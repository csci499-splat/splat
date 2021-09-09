using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class Request
    {
        public string studentID;
        public string status;
        public string requestorAgeCategory;
        public int householdAgeCategoryMinor;
        public int householdAgeCategoryAdult;
        public int householdAgeCategorySenior;
        public bool onMealPlan;
        public DateTime timeOfPickup;
        public Item[] requestedItems;
        public double totalWeightDistributed;
        public List<string> vegetable { get; set; }

        public static List<string> displayOrder;// = GetItemCategoriesDisplayOrder();

        public string StudentID { get => studentID; set => studentID = value; }
        public string Status { get => status; set => status = value; }
        public string RequestorAgeCategory { get => requestorAgeCategory; set => requestorAgeCategory = value; }
        public int HouseholdAgeCategoryMinor { get => householdAgeCategoryMinor; set => householdAgeCategoryMinor = value; }
        public int HouseholdAgeCategoryAdult { get => householdAgeCategoryAdult; set => householdAgeCategoryAdult = value; }
        public int HouseholdAgeCategorySenior { get => householdAgeCategorySenior; set => householdAgeCategorySenior = value; }
        public bool OnMealPlan { get => onMealPlan; set => onMealPlan = value; }
        public DateTime TimeOfPickup { get => timeOfPickup; set => timeOfPickup = value; }
        public Item[] RequestedItems { get => requestedItems; set => requestedItems = value; }
        public double TotalWeightDistributed { get => totalWeightDistributed; set => totalWeightDistributed = value; }

        public Request()
        {
            studentID = "";
            status = "pending";
            requestorAgeCategory = "";
            householdAgeCategoryMinor = 0;
            householdAgeCategoryAdult = 0;
            householdAgeCategorySenior = 0;
            onMealPlan = false;
            timeOfPickup = DateTime.Now;
            requestedItems = new Item[0];
            totalWeightDistributed = 0.0;
        }

        public Request(object[] requestObject)
        {
            studentID = requestObject[0].ToString();
            totalWeightDistributed = decimal.ToDouble((decimal)requestObject[2]);
            RequestorAgeCategory = requestObject[3].ToString();
            householdAgeCategoryMinor = (int)requestObject[4];
            householdAgeCategoryAdult = (int)requestObject[5];
            householdAgeCategorySenior = (int)requestObject[6];
        }

        public static List<String> GetDisplayOrder()
        {
            if(displayOrder == null)
            {
                displayOrder = GetItemCategoriesDisplayOrder();
            }
            return displayOrder;
        }

        public void ParseRequest(string inp)
        {
            int MINIMUM_INPUT = 7;
            int OTHER_NUM = GetDisplayOrder().Count();
            string[] data = inp.Split(';');
            if (data.Length < MINIMUM_INPUT)
            {
                throw new Exception("Some information is missing. " +
                    "Please make sure to input all your personal information and pick a valid pickup time.");
            }
            studentID = data[0];
            if(data[1].Equals("True") || data[1].Equals("False"))
            {
                onMealPlan = data[1].Equals("True");
            }
            else
            {
                throw new Exception("Select if you are on a meal plan.");
            }

            requestorAgeCategory = data[2];
            householdAgeCategoryMinor = Int32.Parse(data[3]);
            householdAgeCategoryAdult = Int32.Parse(data[4]);
            householdAgeCategorySenior = Int32.Parse(data[5]);
            string timeString = data[data.Length - 1];
            try
            {
                timeOfPickup = DateTime.ParseExact(timeString, "yyyy-MM-ddTHH:mm",
                                System.Globalization.CultureInfo.InvariantCulture);
            }
            catch
            {
                throw new Exception("Invalid Date/Time of pickup");
            }

            List<Item> itemList = new List<Item>();
            int offset = 6;
            // requestedItems = new Item[data.Length - 1 - offset - OTHER_NUM];
            int selectedNum = data.Length - offset - OTHER_NUM;
            int i = 0;
            for (; i < selectedNum; i++)
            {
                string newItemName = data[i + offset];
                if (newItemName.Equals("Other"))
                {
                    continue;
                }
                SqlParameter sqlParameter = new SqlParameter("@item_name", newItemName);
                SqlDataReader sqlDataReader = DBConnection.executeSelectProcedure("GetItemCategory", sqlParameter);
                string newItemCategory = "";
                while (sqlDataReader.Read())
                {
                    newItemCategory = ((IDataRecord)sqlDataReader)[0].ToString();
                }
                // requestedItems[i] = new Item(newItemName, newItemCategory);
                itemList.Add(new Item(newItemName, newItemCategory)); // it is NOT ok to add ', ' to items for displaying, so stop it
            }

            offset += i; // + 1;
            List<String> displayOrderTemp = GetDisplayOrder();
            for (int j = 0; j < OTHER_NUM - 1; j++)
            {
                string otherList = data[j + offset];
                string[] otherItems = otherList.Split(',');
                foreach (string otherItem in otherItems)
                {
                    if (!otherItem.Equals(""))
                    {
                        itemList.Add(new Item(UppercaseWords(otherItem.Trim()), displayOrderTemp[j], true));
                    }
                }
            }

            requestedItems = itemList.ToArray();
        }

        public static string GetJSONDisplayOrder()
        {
            StringBuilder JSONDisplayOrder = new StringBuilder();
            JSONDisplayOrder.Append("{");
            JSONDisplayOrder.Append("\"");
            JSONDisplayOrder.Append("DisplayOrder");
            JSONDisplayOrder.Append("\":[");
            foreach(string itemCategory in GetDisplayOrder())
            {
                JSONDisplayOrder.Append("\"");
                JSONDisplayOrder.Append(itemCategory); // .Replace(" ", string.Empty));
                JSONDisplayOrder.Append("\",");
            }
            JSONDisplayOrder.Remove(JSONDisplayOrder.Length - 1, 1); // remove last comma            
            JSONDisplayOrder.Append("]}");
            return JSONDisplayOrder.ToString();
        }

        public static string GetJSONOptions()
        {
            StringBuilder JSONoptions = new StringBuilder();
            string keyItem = "item_name";
            string keyCategory = "category_name";
            JSONoptions.Append("{");
            List<string> disOrder = GetDisplayOrder();
            foreach (string categoryName in disOrder)
            {
                string category = categoryName.Replace(" ", string.Empty);
                List<string> items = GetItemNames(categoryName);
                JSONoptions.Append("\"");
                JSONoptions.Append(category);
                JSONoptions.Append("_");
                JSONoptions.Append("items");
                JSONoptions.Append("\":[");
                foreach (string item in items)
                {
                    JSONoptions.Append("{\"");
                    JSONoptions.Append(keyItem);
                    JSONoptions.Append("\":\"");
                    JSONoptions.Append(item);
                    JSONoptions.Append("\", \"");
                    JSONoptions.Append(keyCategory);
                    JSONoptions.Append("\":\"");
                    JSONoptions.Append(categoryName);
                    JSONoptions.Append("\"},");
                }
                if (items.Count() > 0) JSONoptions.Remove(JSONoptions.Length - 1, 1); // remove last comma
                JSONoptions.Append("],");
            }
            if (disOrder.Count() > 0) JSONoptions.Remove(JSONoptions.Length - 1, 1); // remove last comma            
            JSONoptions.Append("}");
            return JSONoptions.ToString();
        }

        public static List<string> GetItemCategoriesDisplayOrder()
        {
            List<string> displayOrder = new List<string>();
            SqlDataReader sqlDataReader = DBConnection.executeSelectProcedure("SelectItemCategoriesOrderP");
            while (sqlDataReader.Read())
            {
                IDataRecord row = (IDataRecord)sqlDataReader;
                displayOrder.Add(row[0].ToString());
            }
            return displayOrder;
        }

        public static List<string> GetItemNames(string categoryName)
        {
            List<string> itemNames = new List<string>();
            SqlParameter sqlParameter = new SqlParameter("@category_name", categoryName);
            SqlDataReader sqlDataReader = DBConnection.executeSelectProcedure("GetItemsInCategory", sqlParameter);
            while (sqlDataReader.Read())
            {
                itemNames.Add(((IDataRecord)sqlDataReader)[0].ToString());
            }
            return itemNames;
        }

        private static List<string[]> GetPantryHours()
        {
            List<string[]> pantryHours = new List<string[]>();
            SqlDataReader sqlDataReader = DBConnection.executeSelectProcedure("SelectAllPantryHours");
            while (sqlDataReader.Read())
            {
                IDataRecord row = (IDataRecord)sqlDataReader;
                string[] hour = new string[row.FieldCount];
                for(int i = 0; i < hour.Length; i++)
                {
                    hour[i] = row[i].ToString();
                }
                pantryHours.Add(hour);
            }
            return pantryHours;
        }

        public static bool IsDuringPantryHours(DateTime pickUpTime)
        {
            List<string[]> pantryHours = GetPantryHours();
            string[] pickUp = ConverPickUpTime(pickUpTime);
            Dictionary<string, string[]> hourMap = new Dictionary<string, string[]>();
            List<string[]> hoursInDayOfWeek = new List<string[]>();

            foreach(string[] hour in pantryHours)
            {
                hourMap[hour[0]] = new string[] { hour[1], hour[2] };
            }

            string[] value;
            if(hourMap.TryGetValue(pickUp[0], out value))
            {
                hoursInDayOfWeek.Add(value);
            }

            foreach(string[] hour in hoursInDayOfWeek)
            {
                int hourIndex = 0;
                int minuteIndex = 1;
                double minPerHour = 60.0;
                double startHour = Double.Parse((hour[0]).Split(":")[hourIndex]) 
                                 + Double.Parse((hour[0]).Split(":")[minuteIndex]) / minPerHour;
                double endHour = Double.Parse((hour[1]).Split(":")[hourIndex])
                                 + Double.Parse((hour[1]).Split(":")[minuteIndex]) / minPerHour;
                double pickUpHour = Double.Parse((pickUp[1]).Split(":")[hourIndex])
                                 + Double.Parse((pickUp[1]).Split(":")[minuteIndex]) / minPerHour;

                if (startHour <= pickUpHour && pickUpHour <= endHour)
                {
                    return true;
                }
            }

            return false;
        }

        private static string[] ConverPickUpTime(DateTime pickUpTime)
        {
            string dayOfWeek = pickUpTime.DayOfWeek.ToString() + "s";
            string timeOfDay = pickUpTime.TimeOfDay.ToString();
            return new string[] { dayOfWeek, timeOfDay };
        }

        private static string ConvertHour(string hour)
        {
            int hourIndex = 0;
            int minuteIndex = 1;
            int noon = 12;
            bool isMorning = true;
            StringBuilder newHour = new StringBuilder();
            int hourInt = Int32.Parse(hour.Split(":")[hourIndex]);
            int minInt = Int32.Parse(hour.Split(":")[minuteIndex]);
            if (hourInt > noon)
            {
                hourInt -= noon;
                isMorning = false;
            }
            newHour.Append(hourInt); 
            if (minInt > 0)
            {
                newHour.Append(":");
                newHour.Append(minInt);
            }
            string timeOfDay = isMorning && hourInt != noon ? " AM" : " PM";
            newHour.Append(timeOfDay);
            return newHour.ToString();
        }

        public static string GetHTMLHourDisplay()
        {
            List<string[]> hours = GetPantryHours();
            StringBuilder hoursHTML = new StringBuilder();
            hoursHTML.Append("{\"");
            hoursHTML.Append("HTMLHourDisplay\":\"");
            foreach (string[] hour in hours)
            {
                hoursHTML.Append("<b>");
                hoursHTML.Append(hour[0]);
                hoursHTML.Append(" </b>");
                hoursHTML.Append(ConvertHour(hour[1]));
                hoursHTML.Append(" - ");
                hoursHTML.Append(ConvertHour(hour[2]));
                hoursHTML.Append("<br>");
            }
            hoursHTML.Append("\"}");
            return hoursHTML.ToString();
        }

        public List<SqlParameter> GetParameterList()
        {
            List<SqlParameter> parameters = new List<SqlParameter>();
            parameters.Add(new SqlParameter("@student_id", studentID));
            parameters.Add(new SqlParameter("@requestorAgeCategory", requestorAgeCategory));
            parameters.Add(new SqlParameter("@householdAgeCategoryMinor", householdAgeCategoryMinor));
            parameters.Add(new SqlParameter("@householdAgeCategoryAdult", householdAgeCategoryAdult));
            parameters.Add(new SqlParameter("@householdAgeCategorySenior", householdAgeCategorySenior));
            parameters.Add(new SqlParameter("@onMealPlan", onMealPlan));
            DateTime pickUpTimeInSql = DateTime.ParseExact(timeOfPickup.ToString("yyyy-MM-dd HH:mm:ss.fff"),
                                "yyyy-MM-dd HH:mm:ss.fff", System.Globalization.CultureInfo.InvariantCulture);
            parameters.Add(new SqlParameter("@timeOfPickup", pickUpTimeInSql));
            parameters.Add(new SqlParameter("@requestedItems", MakeItemTable()));
            parameters.Add(new SqlParameter("@totalWeightDistributed", "0"));
            parameters.Add(new SqlParameter("@status", "pending"));
            return parameters;
        }

        public DataTable MakeItemTable()
        {
            // Create a new DataTable.
            DataTable table = new DataTable("ItemTable");
            // Declare variables for DataColumn and DataRow objects.
            DataColumn column;
            DataRow row;
            string colName1 = "item_name";
            string colName2 = "item_category";
            string colName3 = "is_from_student";

            // Create first column.
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = colName1;
            column.AutoIncrement = false;
            column.Caption = colName1;
            column.ReadOnly = false;
            column.Unique = false;
            // Add the column to the table.
            table.Columns.Add(column);

            // Create second column.
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.String");
            column.ColumnName = colName2;
            column.AutoIncrement = false;
            column.Caption = colName2;
            column.ReadOnly = false;
            column.Unique = false;
            // Add the column to the table.
            table.Columns.Add(column);

            // Create third column.
            column = new DataColumn();
            column.DataType = System.Type.GetType("System.Boolean");
            column.ColumnName = colName3;
            column.AutoIncrement = false;
            column.Caption = colName3;
            column.ReadOnly = false;
            column.Unique = false;
            // Add the column to the table.
            table.Columns.Add(column);

            // Create new DataRow objects and add
            // them to the DataTable
            foreach (Item item in requestedItems)
            {
                row = table.NewRow();
                row[colName1] = item.ItemName;
                row[colName2] = item.ItemCategory;
                row[colName3] = item.IsStudentInput;
                table.Rows.Add(row);
            }

            return table;
        }

        private string UppercaseWords(string str)
        {
            char[] strArr = str.ToCharArray();
            if (strArr.Length >= 1)
            {
                if (char.IsLower(strArr[0]))
                {
                    strArr[0] = char.ToUpper(strArr[0]);
                }
            }

            for (int i = 1; i < strArr.Length; i++)
            {
                if (strArr[i - 1] == ' ')
                {
                    if (char.IsLower(strArr[i]))
                    {
                        strArr[i] = char.ToUpper(strArr[i]);
                    }
                }
                else
                {
                    char.ToLower(strArr[i]);
                }
            }
            return new string(strArr);
        }
    }
}
