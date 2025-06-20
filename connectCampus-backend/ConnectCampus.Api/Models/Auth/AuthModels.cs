namespace ConnectCampus.Api.Models.Auth;

public record RegisterUserRequest(
    string Email,
    string Password,
    string Role);

public record LoginUserRequest(
    string Email,
    string Password); 