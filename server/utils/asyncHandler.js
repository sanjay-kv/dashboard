const asyncHandler = (requestFunction) => async (req, res, next) => {
	try {
		await requestFunction(req, res, next);
	} catch (error) {
		const statusCode = error.statusCode || 500;
		const message = error.message || "An unexpected error occurred";

		console.log(error);

		res.status(statusCode).json({
			success: false,
			message,
		});
	}
};

export default asyncHandler;
