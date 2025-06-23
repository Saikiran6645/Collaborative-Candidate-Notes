export const generateToken = (user, statusCode, message, res) => {
  const token = user.getJwtToken();
  // console.log("Generated Token:", token);

  res
    .status(statusCode)
    .cookie("token", token, {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    })
    .json({
      success: true,
      message,
      user: { id: user._id, name: user.name, email: user.email },
      token,
    });
};
