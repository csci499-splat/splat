using CsvHelper;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace splat.Util.CSVFileUploads
{
    public class CsvFileParser
    {
        public static IEnumerable<T> ParseCsvFile<T, TMap>(IFormFile file)
            where TMap : CsvHelper.Configuration.ClassMap
        {
            using (var reader = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                try
                {
                    csv.Context.RegisterClassMap<TMap>();
                    return csv.GetRecords<T>().ToList();
                }
                catch
                {
                    throw new Exception("Unable to parse CSV file");
                }
            }
        }

        public static IEnumerable<T> ParseCsvFile<T>(IFormFile file)
        {
            using (var reader = new StreamReader(file.OpenReadStream()))
            using (var csv = new CsvReader(reader, CultureInfo.InvariantCulture))
            {
                try
                {
                    return csv.GetRecords<T>().ToList();
                }
                catch
                {
                    throw new Exception("Unable to parse CSV file");
                }
            }
        }
    }
}
