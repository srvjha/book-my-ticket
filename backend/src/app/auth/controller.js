import authenticationService from "./services.js";
import ApiResponse from "../../utils/api-response.js";
import { cookieOptions } from "../../config/cookie.js";

class AuthenticationController {
  async handleSignUp(req, res) {
    const { username,firstName, lastName, email, password } = req.body;
    const result = await authenticationService.signUp(
      username,
      firstName,
      lastName,
      email,
      password,
    );

    ApiResponse.created({
      res,
      message: "User created successfully",
      data: { id: result.id },
    });
  }

  async handleSignIn(req, res) {
    const { email, password } = req.body;
    const { accessToken, refreshToken } = await authenticationService.signIn(
      email,
      password,
    );

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok({
      res,
      message: "User Logged in Succesfully",
      data: { accessToken },
    });
  }

  async handleMe(req, res) {
    const { id } = req.user;
    const user = await authenticationService.getUser(id);

    ApiResponse.ok({
      res,
      message: "User fetched successfully",
      data: user,
    });
  }

  async handleSignOut(req, res) {
    const { id } = req.user;
    await authenticationService.signOut(id);

    ApiResponse.noContent({
      res: res.clearCookie("refreshToken", cookieOptions),
    });
  }

  async refreshToken(req, res) {
    const { refreshToken: incomingRefreshToken } = req.cookies;
    const { accessToken, refreshToken } =
      await authenticationService.refreshTokens(incomingRefreshToken);

    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 24 * 60 * 60 * 1000,
    });

    ApiResponse.ok({
      res,
      message: "Tokens refreshed successfully",
      data: { accessToken },
    });
  }
}

export default AuthenticationController;
