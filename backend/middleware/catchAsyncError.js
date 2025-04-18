const catchAsyncError = (thifunc) => (req, res, next) => {
    Promise.resolve(thifunc(req, res, next)).catch((err) => {
        next(err);
    });
};

export default catchAsyncError;