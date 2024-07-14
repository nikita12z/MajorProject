const User = require("../models/user.js")

// 10. SIGNUP GET FORM
module.exports.renderSignupForm = (req, res) => {
    res.render("usersignup/signUpform.ejs");
}

// 10. SIGNUP POST
module.exports.signup = async(req, res) =>{

    try{

        let {username, email, password } = req.body;
        const newUser = new User({email, username});
        const registeredUser = await User.register(newUser, password);

        console.log(registeredUser);

        //login method created for automatic login once signup is done. 
        req.login(registeredUser, (err) => {
            if(err) {
                return next(err);
            }
            
            req.flash("success", "Welcome to Wanderlust!");
            res.redirect("/listings");
        });
        
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");
    }
    

}

// 11. LOGIN GET FORM
module.exports.renderLoginForm =  (req, res)=>{
    res.render("usersignup/loginform.ejs");
}

// 11. LOGIN POST 
module.exports.login = async(req, res) => {
    req.flash("success", "Welcome back to Wanderlust!"); 
    
    //condition set to check if url is present or not
    let redirectUrl = res.locals.redirectUrl || "/listings";
    res.redirect(redirectUrl);    
}

// 12. LOGOUT GET
module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "You are logged out!");
        res.redirect("/listings");
    });
}