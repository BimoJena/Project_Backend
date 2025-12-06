const asyncHandler = (requestHandler) => {
    //requestHandler is nothing but a controller jo yaha se pass hoga
    return (req,res,next) => {
        Promise.resolve(requestHandler(req,res,next))
        .catch((err) => next(err))
    }
}

export {asyncHandler}



/* 

-----upr humne promise se kiya same chiz krne ka dusra tarika with try-catch-----

const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}

*/