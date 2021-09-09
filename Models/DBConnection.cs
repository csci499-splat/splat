using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Mvc.Rendering;
using Org.BouncyCastle.Crypto.Parameters;
using Org.BouncyCastle.Asn1.X509;
using Org.BouncyCastle.Security;
using Org.BouncyCastle.X509;

namespace SPLAT.Models
{
    public class DBConnection
    {
        private string connectionString;                    //string containing connection details
        private static SqlConnection connection;
        private static DBConnection uniqueConnection;       //stores a unique connection

        private DBConnection()
        {
            connectionString = DBCreator.ConnectionString.Default.connStrSPLAT;
            //connectionString = @"Data Source=(localdb)\mssqllocaldb; database=master; MultipleActiveResultSets=True; Integrated Security=True";
            connection = new SqlConnection(connectionString);
        }

        public static DBConnection getInstance()
        {
            if (uniqueConnection == null)
            {
                uniqueConnection = new DBConnection();
            }
            return uniqueConnection;
        }

        public static void openConnection()    //attempt to open connection if it is not already open
        {
            if (connection.State != ConnectionState.Open) { connection.Open(); }
        }

        public static void closeConnection()   //attempt to close connection if it is not already closed
        {
            if (connection.State != ConnectionState.Closed) { connection.Close(); }
        }

        public static SqlDataReader executeSelectProcedure(string procedureName, List<SqlParameter> parameters)     //executes a select stored procedure with a list of parameters
        {
            getInstance();
            SqlCommand cmd = buildStoredProcedureCmd(procedureName, parameters);
            openConnection();
            SqlDataReader reader = cmd.ExecuteReader();
            //closeConnection();
            return reader;
        }

        public static SqlDataReader executeSelectProcedure(string procedureName, SqlParameter parameter = null)     //executes a select stored procedure with a singular parameter
        {
            getInstance();
            SqlCommand cmd;
            if (parameter != null)
            {
                List<SqlParameter> parameters = new List<SqlParameter>();
                parameters.Add(parameter);
                cmd = buildStoredProcedureCmd(procedureName, parameters);
            }
            else
            {
                cmd = buildStoredProcedureCmd(procedureName);
            }
            openConnection();
            SqlDataReader reader = cmd.ExecuteReader();
            //closeConnection();
            return reader;
        }
  
        public static void executeNonSelectProcedure(string procedureName, List<SqlParameter> parameters = null)    //executes a non-select stored procedure with a list of parameters
        {
            getInstance();
            SqlCommand cmd = buildStoredProcedureCmd(procedureName, parameters);
            openConnection();
            cmd.ExecuteNonQuery();
        }
 
        private static SqlCommand buildStoredProcedureCmd(string procedureName, List<SqlParameter> parameters = null)
        {
            SqlCommand cmd = new SqlCommand(procedureName, connection);
            cmd.CommandType = CommandType.StoredProcedure;
            if (parameters != null)
            {
                for (int i = 0; i < parameters.Count; i++)
                {
                    cmd.Parameters.Add(parameters[i]);
                }
            }
            return cmd;
        }
        public static List<Discard> SelectAllDiscards()
        {
            SqlDataReader reader = executeSelectProcedure("SelectAllDiscard");
            List<Discard> discards = new List<Discard>();
            while (reader.Read())
            {
                discards.Add(
                    new Discard(
                        (DateTime)reader["date"],
                    Decimal.ToDouble((Decimal)reader["weight"]),
                    (String)reader["reason"]));
            }
            return discards;
        }
        public static List<Request> fetchPendingRequests()
        {
            SqlDataReader reader =  executeSelectProcedure("GetPendingDisbursement");
            List<Request> pendingRequests = new List<Request>();
            int i = 0;
            while (reader.Read())
            {
                pendingRequests.Add(new Request());
                pendingRequests[i].StudentID = (string)reader["student_id"];
                pendingRequests[i].TimeOfPickup = (DateTime)reader["date_start"];
                i++;
            }
            return pendingRequests;
        }
        public static List<Request> fetchPendingRequestsByStudentID(string studentID)
        {
            SqlParameter sqlParameter = new SqlParameter("@student_id", studentID);
            SqlDataReader reader =  executeSelectProcedure("GetPendingDisbursementByStudentId", sqlParameter);
            List<Request> pendingRequests = new List<Request>();
            int i = 0;
            while (reader.Read())
            {
                pendingRequests.Add(new Request());
                pendingRequests[i].StudentID = (string)reader["student_id"];
                pendingRequests[i].TimeOfPickup = (DateTime)reader["date_start"];
                i++;
            }
            return pendingRequests;
        }
        public static List<object> fetch(string procedurename, List<SqlParameter> parameters = null)
        {
            SqlDataReader reader = executeSelectProcedure(procedurename, parameters);
            List<object> queryList = new List<object>();
            while (reader.Read())
            {
                Object[] queryRow = new Object[reader.FieldCount];
                for (int i = 0; i < reader.FieldCount; i++)
                {
                    queryRow[i] = reader[i];
                }
                queryList.Add(queryRow);
            }
            return queryList;
        }
        public static Request selectRequest(string studentID, DateTime pickupTime)
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@student_id", studentID));
            parameters.Add(new SqlParameter("@date_start", pickupTime));
            //object example = fetch("SelectRequest", parameters);
            SqlDataReader reader = executeSelectProcedure("SelectRequest", parameters);
            Request selectedRequest = new Request();
            reader.Read();
            selectedRequest.StudentID = studentID;
            selectedRequest.timeOfPickup = pickupTime;
            selectedRequest.requestorAgeCategory = (String)reader["student_age_group"];
            selectedRequest.onMealPlan = (bool)reader["on_meal_plan"];          
            selectedRequest.householdAgeCategoryMinor = (int)reader["household_category_minor_count"];
            selectedRequest.householdAgeCategoryAdult = (int)reader["household_category_adult_count"];
            selectedRequest.householdAgeCategorySenior = (int)reader["household_category_senior_count"];
            reader.NextResult();
            List<Item> itemList = new List<Item>();
            while (reader.Read())
            {
                itemList.Add(new Item((string)reader["item_name"],(string)reader["item_category_name"]));
            }
            selectedRequest.RequestedItems = itemList.ToArray();
            return selectedRequest;
        }
        public static List<Staff> fetchStaff()
        {
            SqlDataReader reader = executeSelectProcedure("SelectAllStaff");
            List<Staff> accounts = new List<Staff>();
            int i = 0;
            while (reader.Read())
            {
                accounts.Add(new Staff());
                accounts[i].Username = (string)reader["username"];
                accounts[i].IsAdmin = (bool)reader["is_Admin"];
                i++;
            }
            return accounts;
        }
 
    }

    public class SplatCrypto
    {
        private static CspParameters cspParams;
        private static RSACryptoServiceProvider rsa;
        private static SplatCrypto uniqueCrypto;
        private static string keyContainer = "theContainer";
        private const string pubKeyFile = "publicKey.txt";
        private static string pubKeyPath;

        private SplatCrypto(bool overwriteKey, bool storeKeyToFile)
        {
            cspParams = new CspParameters
            {
                KeyContainerName = keyContainer
            };
            rsa = new RSACryptoServiceProvider(cspParams);
            if (storeKeyToFile)
            {
                pubKeyPath = Directory.GetCurrentDirectory() + "\\" + pubKeyFile;
                StorePublicKeyToFile(overwriteKey);
            }
        }

        public static SplatCrypto GetInstance(bool overwriteKey = false, bool storeKeyToFile = false)
        {
            if (cspParams == null)
            {
                uniqueCrypto = new SplatCrypto(overwriteKey, storeKeyToFile);
            }
            return uniqueCrypto;
        }

        private static void StorePublicKeyToFile(bool overwriteKey = false)     //creates a txt file containing the public key
        {
            //store the public key in a txt file
            if (overwriteKey && File.Exists(pubKeyPath))
            {
                File.Delete(pubKeyPath);
            }
            if (!File.Exists(pubKeyPath))
            {
                File.Create(pubKeyPath).Dispose();  //creates the new public key file and disposes of the File object when done
                using (StreamWriter writer = new StreamWriter(pubKeyPath))
                {
                    writer.Write(GetPublicKey());   //writes [only] the public key to the key file in PEM format
                    writer.Close();
                }
            }
        }

        public static string GetPublicKey()        //retrieves the public key from the key store and converts it to PEM format
        {
            RsaKeyParameters kp = DotNetUtilities.GetRsaPublicKey(rsa);         //get the public key via BouncyCastle's DotNetUtilities
            SubjectPublicKeyInfo pubKeyInfo = SubjectPublicKeyInfoFactory.CreateSubjectPublicKeyInfo(kp);   //pubKeyInfo contains the public key in x.509 format
            string pubKeyXML = Convert.ToBase64String(pubKeyInfo.GetEncoded()); //use BouncyCastle to get encoded xml, then convert to string
            return XmlToPem(pubKeyXML);
        }

        public static string GetPublicKeyFromFile() //retrieves the public key from the txt file
        {
            StreamReader rdr = new StreamReader(pubKeyPath);
            string pubKey = rdr.ReadToEnd();
            return pubKey;
        }

        private static string GetPrivateKey()       //retrieves the private key from the keyContainer
        {
            return (rsa.ToXmlString(true));
            //ReadOnlySpan<byte> privKey = Convert.FromBase64String(test);
        }

        public static string Decrypt(byte[] ciphertext, bool oaepPadding = false)
        {
            byte[] decryptedBytes = rsa.Decrypt(ciphertext, oaepPadding);
            string decryptedString = Encoding.Default.GetString(decryptedBytes);
            return decryptedString;
        }

        public static bool AuthenticateStaff(Staff staff)       //verifies whether a matching staff object is present in the DB
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@username", staff.Username));
            parameters.Add(new SqlParameter("@password", staff.Password));
            SqlDataReader reader = DBConnection.executeSelectProcedure("ExistStaff", parameters);
            reader.Read();
            return reader.GetBoolean(0);
        }

        public static bool AuthenticateStaffSecure(Staff staff) //verifies whether a matching staff object is present in the DB (uses salt)
        {
            SqlParameter parameter = new SqlParameter("@username", staff.Username);
            SqlDataReader reader = DBConnection.executeSelectProcedure("SelectStaff", parameter);
            string storedPassword;
            byte[] storedSalt = new byte[32];
            int passwordIndex = 1; int saltIndex = 3;   //the indices in 'reader' for the specified data
            try
            {
                if (reader.Read())
                {
                    storedPassword = reader.GetString(passwordIndex);
                    reader.GetBytes(saltIndex, 0, storedSalt, 0, 32);
                    string hashWord = GenerateHash(staff.Password, storedSalt); //use storedSalt to hash entered password and compare result to storedPassword                    
                    if (hashWord == storedPassword) { return true; }
                }
            }
            catch { return false; }
            return false;
        }

        public static bool ResetPassword(Staff staff, string newPassword)       //changes the password (and salt)
        {
            if (!StaffExists(staff.Username)) { return false; }                 //ensure user exists
            byte[] newSalt = GenerateSalt();                                    //generate a new salt
            string hashedNewPassword = GenerateHash(newPassword, newSalt);      //hash the new password using the new salt
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@username", staff.Username));      
            parameters.Add(new SqlParameter("@password_new", hashedNewPassword));   //update the password
            parameters.Add(new SqlParameter("@salt_new", newSalt));                 //update the salt
            try
            {
                SqlDataReader reader = DBConnection.executeSelectProcedure("UpdateStaffPassword", parameters);
            }
            catch { return false; }
            return true;
        }

        private static bool StaffExists(string username)    //checks if specified Staff entity exists in DB
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@username", username));
            SqlDataReader reader = DBConnection.executeSelectProcedure("SelectStaff", parameters);
            if (reader.Read()) { return true; }
            return false;
        }

        public static bool AdminExists(string username)    //verifies whether the staff member is an admin
        {
            SqlParameter parameter = new SqlParameter("@username", username);
            SqlDataReader reader = DBConnection.executeSelectProcedure("IsAdmin", parameter);
            if (reader.Read())
            {
                bool isAdmin = reader.GetBoolean(0);
                if (isAdmin) { return true; }
            }
            return false;
        }

        private static string XmlToPem(string xml, string keyType = "PUBLIC KEY")
        {
            StringBuilder sb = new StringBuilder();
            string pemBegin = "-----BEGIN " + keyType + "-----\n";
            sb.AppendFormat(pemBegin);  //add prekey flag for PEM key

            //the following  conversion is credit of misaxi: https://gist.github.com/misaxi/4642030
            int line = 1, width = 64;   //each line in PEM format contains exactly 64 chars, except the last one may contain fewer--Josh
            while ((line - 1) * width < xml.Length)
            {
                int startIndex = (line - 1) * width;
                int len = line * width > xml.Length
                              ? xml.Length - startIndex
                              : width;
                /*simplification of above to help me understand--Josh
                int len;
                if (line * width > xml.Length)
                {
                    len = xml.Length - startIndex;
                }
                else { len = width; }
                */
                sb.AppendFormat("{0}\n", xml.Substring(startIndex, len));
                line++;
            }

            string pemEnd = "-----END " + keyType + "-----\n";
            sb.AppendFormat(pemEnd);    //add postkey flag for PEM key
            return sb.ToString();
        }

        private static string GenerateHash(string plainTxt, byte[] salt)    //generates a salted hash using SHA256 w/ 30,000 iterations
        {
            string hashedTxt = Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: plainTxt,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA256,   //use HMAC w/ SHA256
                iterationCount: 30000,              //run the prf 30,000 times
                numBytesRequested: 32));
            return hashedTxt;
        }

        private static byte[] GenerateSalt(int nonceLength = 32)   //generates a csr salt
        {
            byte[] nonce = new byte[nonceLength];
            using (RNGCryptoServiceProvider rngCsp = new RNGCryptoServiceProvider())
            {
                rngCsp.GetBytes(nonce);
            }
            return nonce;
        }

    }
}
