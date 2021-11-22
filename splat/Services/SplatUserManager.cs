using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using splat.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services
{
    public class SplatUserManager<TUser> : UserManager<TUser> where TUser : IdentityUser<Guid>
    {
        private readonly LDAPAuthenticationOptions _authenticationOptions;
        public SplatUserManager(IUserStore<TUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<TUser> passwordHasher, IEnumerable<IUserValidator<TUser>> userValidators, IEnumerable<IPasswordValidator<TUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<TUser>> logger, IOptions<LDAPAuthenticationOptions> ldapOptions)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
            _authenticationOptions = ldapOptions.Value;
        }

        public override async Task<bool> CheckPasswordAsync(TUser user, string password)
        {
            using (var auth = new LDAPAuthentication(_authenticationOptions))
            {
                if (auth.ValidatePassword(user.UserName, password))
                {
                    Console.WriteLine("validate returned true");
                    return true;
                }
            }

            return false;
        }

        public override Task<IdentityResult> ChangePasswordAsync(TUser user, string currentPassword, string newPassword)
        {
            throw new NotSupportedException();
        }

        public override Task<IdentityResult> AddPasswordAsync(TUser user, string password)
        {
            throw new NotSupportedException();
        }


        public override Task<bool> HasPasswordAsync(TUser user)
        {
            return Task.FromResult(true);
        }


        protected override Task<PasswordVerificationResult> VerifyPasswordAsync(IUserPasswordStore<TUser> store, TUser user, string password)
        {
            throw new NotSupportedException();
        }


        public override Task<IdentityResult> ResetPasswordAsync(TUser user, string token, string newPassword)
        {
            throw new NotSupportedException();
        }
    }
}
