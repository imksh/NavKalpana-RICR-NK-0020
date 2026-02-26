import AiModel from "../models/aiModel.model.js";
import AiConversation from "../models/aiConversation.model.js";
import QuizResult from "../models/quizResult.model.js";
import Quiz from "../models/quiz.model.js";

const OUT_OF_SCOPE_RESPONSE =
  "This question is outside my role. Please ask a role-related question or choose a more suitable AI mentor.";

const MODEL_SCOPE_KEYWORDS = {
  CourseHelper: [
    "course",
    "concept",
    "topic",
    "syllabus",
    "module",
    "lesson",
    "study",
    "learn",
    "exam",
    "assignment",
  ],
  PlacementHelper: [
    "placement",
    "interview",
    "resume",
    "cv",
    "job",
    "salary",
    "hr",
    "aptitude",
    "company",
    "offer",
  ],
  DoubtSolver: [
    "doubt",
    "explain",
    "clarify",
    "why",
    "how",
    "error",
    "issue",
    "fix",
    "problem",
    "step",
  ],
  CareerGuide: [
    "career",
    "roadmap",
    "goal",
    "industry",
    "growth",
    "skill",
    "switch",
    "future",
    "domain",
    "opportunity",
  ],
  ProjectMentor: [
    "project",
    "architecture",
    "design",
    "debug",
    "code",
    "scalable",
    "deploy",
    "production",
    "api",
    "database",
  ],
  DSAMentor: [
    "dsa",
    "array",
    "linked list",
    "tree",
    "graph",
    "stack",
    "queue",
    "recursion",
    "dynamic programming",
    "complexity",
    "algorithm",
    "sorting",
    "searching",
  ],
  FSDMentor: [
    "full stack",
    "frontend",
    "backend",
    "react",
    "node",
    "express",
    "mongodb",
    "authentication",
    "mern",
    "deployment",
  ],
  ProgrammingBasicsMentor: [
    "programming",
    "variable",
    "loop",
    "condition",
    "function",
    "oop",
    "beginner",
    "syntax",
    "logic",
    "if else",
  ],
};

// ================================
// Get all available AI models
// ================================
export const getAiModels = async (req, res, next) => {
  try {
    const models = await AiModel.find({ isActive: true }).select(
      "-systemPrompt",
    );
    res.status(200).json(models);
  } catch (error) {
    console.error("Error fetching AI models:", error);
    next(error);
  }
};

// ================================
// Chat with AI
// ================================
export const chatWithAi = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { modelName, message, courseId, conversationId } = req.body;

    if (!modelName || !message) {
      return res
        .status(400)
        .json({ error: "Model name and message are required" });
    }

    const aiModel = await AiModel.findOne({ name: modelName, isActive: true });

    if (!aiModel) {
      return res.status(404).json({ error: "AI model not found" });
    }

    let conversation;

    if (conversationId) {
      conversation = await AiConversation.findById(conversationId);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
    } else {
      conversation = new AiConversation({
        studentId: userId,
        courseId: courseId || null,
        modelName,
        messages: [],
      });
    }

    conversation.messages.push({
      role: "user",
      content: message,
    });

    // Limit conversation context (last 10 messages only)
    const limitedMessages = conversation.messages.slice(-10);
    const inScope = isMessageInModelScope(aiModel.name, message);

    const aiResponse = inScope
      ? await generateAiResponse(
          buildScopedSystemPrompt(aiModel.systemPrompt),
          limitedMessages,
        )
      : OUT_OF_SCOPE_RESPONSE;

    conversation.messages.push({
      role: "assistant",
      content: aiResponse,
    });

    await conversation.save();

    res.status(200).json({
      conversationId: conversation._id,
      response: aiResponse,
      messages: conversation.messages,
      outOfScope: !inScope,
    });
  } catch (error) {
    console.error("Error in chatWithAi:", error);
    next(error);
  }
};

function isMessageInModelScope(modelName, message) {
  const modelKeywords = MODEL_SCOPE_KEYWORDS[modelName];

  if (!modelKeywords || !message) {
    return true;
  }

  const normalizedMessage = message.toLowerCase();
  return modelKeywords.some((keyword) => normalizedMessage.includes(keyword));
}

function buildScopedSystemPrompt(basePrompt) {
  return `${basePrompt}\n\nImportant Rule: Answer only questions related to your assigned role. If the question is outside your role, respond exactly with: "${OUT_OF_SCOPE_RESPONSE}"`;
}

// ================================
// Get single conversation
// ================================
export const getConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await AiConversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.studentId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to access this conversation" });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error("Error fetching conversation:", error);
    next(error);
  }
};

// ================================
// Get all user conversations
// ================================
export const getUserConversations = async (req, res, next) => {
  try {
    const conversations = await AiConversation.find({
      studentId: req.user._id,
    })
      .select("modelName courseId createdAt isActive")
      .sort({ createdAt: -1 });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    next(error);
  }
};

// ================================
// Delete conversation
// ================================
export const deleteConversation = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await AiConversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversation not found" });
    }

    if (conversation.studentId.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ error: "Unauthorized to delete this conversation" });
    }

    await AiConversation.deleteOne({ _id: conversationId });

    res.status(200).json({ message: "Conversation deleted successfully" });
  } catch (error) {
    console.error("Error deleting conversation:", error);
    next(error);
  }
};

// ================================
// AI Response Generator
// ================================
async function generateAiResponse(systemPrompt, messages) {
  const formattedMessages = [
    { role: "system", content: systemPrompt },
    ...messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  if (process.env.GROQ_API_KEY) {
    return await callGroqApi(formattedMessages);
  }

  if (process.env.OPENAI_API_KEY) {
    return await callOpenAiApi(formattedMessages);
  }

  return "AI service not configured.";
}

// ================================
// GROQ INTEGRATION (FIXED)
// ================================
async function callGroqApi(messages) {
  const Groq = await import("groq-sdk");

  const client = new Groq.default({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    return await generateWithModel(
      client,
      process.env.GROQ_MODEL || "llama3-70b-8192",
      messages,
    );
  } catch (error) {
    console.warn("Primary model failed. Using fallback model...");
    return await generateWithModel(
      client,
      process.env.GROQ_FALLBACK_MODEL || "llama3-8b-8192",
      messages,
    );
  }
}

async function generateWithModel(client, model, messages) {
  const response = await client.chat.completions.create({
    model,
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  if (!response?.choices?.length) {
    throw new Error("No response from AI model");
  }

  return response.choices[0].message.content;
}

// ================================
// OPENAI FALLBACK
// ================================
async function callOpenAiApi(messages) {
  const OpenAI = await import("openai");

  const client = new OpenAI.default({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.7,
    max_tokens: 1024,
  });

  return response.choices[0].message.content;
}

// ================================
// QUIZ REVIEW - AI Analysis
// ================================
export const getQuizReview = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { quizId, courseId } = req.body;

    if (!quizId) {
      return res.status(400).json({ error: "Quiz ID is required" });
    }

    // Fetch quiz details
    const quiz = await Quiz.findById(quizId).lean();
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Fetch student's quiz result
    const quizResult = await QuizResult.findOne({
      quizId: quizId,
      studentId: userId,
    })
      .sort({ createdAt: -1 })
      .lean();

    if (!quizResult) {
      return res
        .status(404)
        .json({ error: "Quiz result not found. Complete the quiz first." });
    }

    // Use already-calculated score from quiz result
    const score = quizResult.scorePercent;
    const correctCount = quizResult.correctCount;
    const totalQuestions = quizResult.totalQuestions;

    // Extract correct and wrong questions from answers
    const wrongQuestions = [];
    const correctQuestions = [];

    quizResult.answers.forEach((answer) => {
      const question = quiz.questions[answer.questionIndex];
      if (!question) return;

      if (answer.isCorrect) {
        correctQuestions.push(question.questionText);
      } else {
        wrongQuestions.push({
          question: question.questionText,
          studentAnswer:
            question.options[answer.selectedAnswerIndex] || "Not answered",
          correctAnswer: question.options[answer.correctAnswerIndex],
        });
      }
    });

    // Generate strengths, improvements, and suggestions
    const prompt = `Analyze this student's quiz performance and provide feedback:

Quiz: ${quiz.title}
Total Questions: ${totalQuestions}
Correct Answers: ${correctCount}
Score: ${score}%

Correct Topics: ${correctQuestions.slice(0, 3).join(", ") || "None"}
Topics to Work On: ${
      wrongQuestions
        .slice(0, 3)
        .map((q) => q.question)
        .join(", ") || "None"
    }

Provide a brief JSON response with:
{
  "strengths": ["array of 2-3 key strengths"],
  "improvements": ["array of 2-3 areas to improve"],
  "suggestions": ["array of 2-3 actionable suggestions"]
}

Respond with ONLY the JSON, no other text.`;

    const messages = [{ role: "user", content: prompt }];

    let reviewAnalysis;
    try {
      const aiResponse = await generateAiResponse(
        "You are an educational assessment expert. Analyze quiz performance and provide constructive feedback.",
        messages,
      );

      // Parse JSON response
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        reviewAnalysis = JSON.parse(jsonMatch[0]);
      } else {
        reviewAnalysis = {
          strengths: ["Good effort on the quiz"],
          improvements: ["Review the topics you found challenging"],
          suggestions: ["Practice more questions on weak areas"],
        };
      }
    } catch (error) {
      console.error("Error generating AI review:", error);
      reviewAnalysis = {
        strengths: ["You completed the quiz"],
        improvements: ["Review areas where you scored less"],
        suggestions: ["Practice similar questions to improve"],
      };
    }

    const aiReview = `I've reviewed your quiz performance on "${quiz.title}". You scored ${score}%, getting ${correctCount} out of ${totalQuestions} questions correct. Let me share some insights and help you improve!`;

    res.status(200).json({
      score,
      correctCount,
      totalQuestions,
      aiReview,
      strengths: reviewAnalysis.strengths || [],
      improvements: reviewAnalysis.improvements || [],
      suggestions: reviewAnalysis.suggestions || [],
      wrongQuestions: wrongQuestions.slice(0, 5), // Limit to top 5 wrong questions
    });
  } catch (error) {
    console.error("Error in getQuizReview:", error);
    next(error);
  }
};
