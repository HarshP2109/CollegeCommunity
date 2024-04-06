const requireAuth = (req, res, next) => {   //Authenticator
    if (req.session.User) {
        next();
    } else {
        res.redirect('/');
    }
}

const goo = (req, res, next) => {
  if (req.session.User) {
      res.redirect('/dash');
  } else {
      next();
  }
}

module.exports = {
    requireAuth, 
    goo
}