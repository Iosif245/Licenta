using ConnectCampus.Application.Common.Interfaces;
using System;
using System.Security.Cryptography;

namespace ConnectCampus.Infrastructure.Services
{
    public class PasswordHasher : IPasswordHasher
    {
        private const int SaltSize = 128 / 8;
        private const int KeySize = 256 / 8;
        private const int Iterations = 10000;
        private static readonly HashAlgorithmName _hashAlgorithmName = HashAlgorithmName.SHA256;
        private const char Delimiter = ';';

        public string HashPassword(string password)
        {
            var salt = RandomNumberGenerator.GetBytes(SaltSize);
            var hash = Rfc2898DeriveBytes.Pbkdf2(
                password,
                salt,
                Iterations,
                _hashAlgorithmName,
                KeySize);

            return string.Join(
                Delimiter,
                Convert.ToBase64String(salt),
                Convert.ToBase64String(hash),
                Iterations,
                _hashAlgorithmName);
        }

        public bool VerifyPassword(string hashedPassword, string providedPassword)
        {
            var elements = hashedPassword.Split(Delimiter);
            var salt = Convert.FromBase64String(elements[0]);
            var hash = Convert.FromBase64String(elements[1]);
            var iterations = int.Parse(elements[2]);
            var hashAlgorithmName = new HashAlgorithmName(elements[3]);

            var hashToCheck = Rfc2898DeriveBytes.Pbkdf2(
                providedPassword,
                salt,
                iterations,
                hashAlgorithmName,
                hash.Length);

            return CryptographicOperations.FixedTimeEquals(hash, hashToCheck);
        }
    }
}