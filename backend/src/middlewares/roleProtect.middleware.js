export const adminProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      const error = new Error("Unauthorized! Only admin can do this");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const studentProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "student") {
      const error = new Error("Unauthorized! Only rider can do this");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const instructorProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "instructor") {
      const error = new Error(
        "Unauthorized! Only restaurant manager can do this",
      );
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};
