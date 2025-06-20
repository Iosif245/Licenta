using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using ConnectCampus.Application.Common.Interfaces;
using ConnectCampus.Domain.Common.Time;
using ConnectCampus.Domain.Entities;
using ConnectCampus.Infrastructure.Configuration.Settings;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ConnectCampus.Infrastructure.Services
{
    public class JwtTokenGenerator : IJwtTokenGenerator
    {
        private readonly JwtSettings _jwtSettings;
        private readonly IDateTimeMachine _dateTimeMachine;

        public JwtTokenGenerator(
            IOptions<JwtSettings> jwtSettings,
            IDateTimeMachine dateTimeMachine)
        {
            _jwtSettings = jwtSettings.Value;
            _dateTimeMachine = dateTimeMachine;
        }

        public string GenerateToken(User user)
        {
            var signingCredentials = new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSettings.Secret)),
                SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Role, user.Role.Name),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            var securityToken = new JwtSecurityToken(
                issuer: _jwtSettings.Issuer,
                audience: _jwtSettings.Audience,
                expires: _dateTimeMachine.UtcNow.AddMinutes(_jwtSettings.ExpiryMinutes),
                claims: claims,
                signingCredentials: signingCredentials);

            return new JwtSecurityTokenHandler().WriteToken(securityToken);
        }
    }
}