using System;
using System.Collections.Generic;
using System.DirectoryServices.AccountManagement;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Services
{
    public class LDAPAuthentication : IDisposable
    {
        private readonly LDAPAuthenticationOptions _options;
        private readonly PrincipalContext _connection;
        private bool _isDisposed = false;

        public LDAPAuthentication(LDAPAuthenticationOptions options)
        {
            _options = options;
            Console.WriteLine(options);
            _connection = new PrincipalContext(ContextType.Domain, options.LDAPServer, options.Account, options.Password);
        }

        public void Dispose()
        {
            if (_isDisposed)
            {
                return;
            }

            _connection.Dispose();
            _isDisposed = true;
        }

        public bool ValidatePassword(string distinguishedName, string password)
        {
            if (_isDisposed)
            {
                throw new ObjectDisposedException(nameof(PrincipalContext));
            }

            if (string.IsNullOrEmpty(_options.LDAPServer))
            {
                throw new InvalidOperationException("The LDAP Hostname cannot be empty or null.");
            }

            return _connection.ValidateCredentials(distinguishedName, password);
         }

    }

}
