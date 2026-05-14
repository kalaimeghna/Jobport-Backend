const employerOnly = (req, res, next)=>{
    try{
        // check user exists
        if(!req.user) {
            return res.status(401).json({
                success:false,
                message: "User not found",
            });
        }
        //Check employer role
        if(req.user.role !== "employer") {
            return res.status(403).json({
                success:false,
                message: "Employer access only",
            });
        }
        next();
    }catch(error){
        return res.status(500).json({
            success:false,
            message:error.message,

        });
    }
};

export default employerOnly;