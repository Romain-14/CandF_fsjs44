export default (req, res, next) => {
    console.log(req.session)
    if(!req.session?.userInfo?.isAdmin) {
        res.redirect("http://localhost:"+ process.env.LOCAL_PORT)
    }
    if(req.session?.userInfo?.isAdmin ) next();

}