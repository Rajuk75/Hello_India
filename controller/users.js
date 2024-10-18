const User=require("../models/user");

module.exports.renserSignupForm=(req,res)=>{
    res.render("users/signup.ejs");
}
module.exports.signup=async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const newUser = new User({ username, email });
        
        // Register the new user
        const registerUser = await User.register(newUser, password);
        console.log(registerUser);

        // Log the user in after successful registration
        req.login(registerUser, (err) => {
            if (err) {
                return next(err); // Handle login error
            }
            req.flash("success", "User registered successfully");
            res.redirect("/listings"); // Redirect to listings after successful login
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signUp");
    }
};

module.exports.renderLoginForm=(req,res)=>{
    res.render("users/login.ejs");
}

module.exports.login=async (req, res) => {
    req.flash("success", "Welcome back!");

    // Redirect to the stored URL or default to /listings
    let redirectUrl = res.locals.redirectUrl || "/listings";
    delete req.session.redirectUrl;  // Clear the session variable after redirecting
    res.redirect(redirectUrl);       // Redirect user to the correct page
};


module.exports.logout=(req, res) => {
    req.logout((err)=> {
        if (err) { 
            return next(err); 
        }  // Handle any potential errors
        req.flash("success", "You have successfully logged out!");  // Flash a success message
        res.redirect("/listings");  // Redirect to the listings page after logout
    });
}