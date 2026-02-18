export const AdminProtect = async (req, res, next) => {
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
export const PartnerProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "partner") {
      const error = new Error("Unauthorized! Only rider can do this");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};
export const ManagerProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "manager") {
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
export const CustomerProtect = async (req, res, next) => {
  try {
    if (req.user.role !== "customer") {
      const error = new Error("Unauthorized! Only user can do this");
      error.statusCode = 401;
      return next(error);
    }
    next();
  } catch (error) {
    next(error);
  }
};