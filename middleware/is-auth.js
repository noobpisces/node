module.exports = (req, res, next) => {
    if (!req.session.isLoggedIn) {
        req.flash('error', 'Vui lòng đăng nhập lại để sử dụng');
        return res.redirect('/login');
    }
    next();
}