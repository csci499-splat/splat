using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace SPLAT.Models
{
    public class TrendReportData
    {
        private Item trendItem;         
        private List<int> monthlyRequests = new List<int>();    
        private int totalItemRequests;          
        private double slope;
        private double yIntercept;
        private double meanX;
        private double meanY;

        public Item TrendItem { get => trendItem; set => trendItem = value; }
        public List<int> MonthlyRequests { get => monthlyRequests; set => monthlyRequests = value; }
        public int TotalItemRequests { get => totalItemRequests; set => totalItemRequests = value; }
        public double Slope { get => slope; set => slope = value; }
        public double YIntercept { get => yIntercept; set => yIntercept = value; }
        public double MeanX { get => meanX; set => meanX = value; }
        public double MeanY { get => meanY; set => meanY = value; }
        public TrendReportData() { }
        public TrendReportData(Item trendItem, List<int> monthlyRequests, int totalRequests = 0, double slope = 0, double yIntercept = 0, double meanX = 0, double meanY = 0)
        {
            this.trendItem = trendItem;
            this.monthlyRequests = monthlyRequests;
            this.totalItemRequests = totalRequests;
            this.slope = slope;
            this.yIntercept = yIntercept;
            this.meanX = meanX;
            this.meanY = meanY;
        }

    }

    public class TrendReport
    {
        private ItemCategory category;
        private DateTime startDate;
        private DateTime endDate;
        private int monthRange = 6;
        private int totalRequests = 0;
        private int maxRequestAmount = 0;
        private List<string> monthNames = new List<string>();
        private List<TrendReportData> reports = new List<TrendReportData>();

        public ItemCategory Category { get => category; set => category = value; }
        public DateTime StartDate { get => startDate; set => startDate = value; }
        public DateTime EndDate { get => endDate; set => endDate = value; }
        public int MonthRange { get => monthRange; set => monthRange = value; }
        public int TotalRequests { get => totalRequests; set => totalRequests = value; }
        public int MaxRequestAmount { get => maxRequestAmount; set => maxRequestAmount = value; }
        public List<string> MonthNames { get => monthNames; set => monthNames = value; }
        public List<TrendReportData> Reports { get => reports; set => reports = value; }

        public TrendReport()
        {

        }

        public TrendReport(ItemCategory category, DateTime startDate)
        {
            if (!VerifyStartDate(startDate)) { throw new Exception("incorrectStartDate"); }
            this.category = category;
            this.startDate = startDate;
            GenerateEndDate();              //generate the end date for the report
        }

        public TrendReport(ItemCategory category, DateTime startDate, DateTime endDate)
        {
            if (!VerifyStartDate(startDate)) { throw new Exception("incorrectStartDate"); }
            if (!VerifyEndDate(endDate)) { throw new Exception("incorrectEndDate"); }
            this.category = category;
            this.startDate = startDate;
            GenerateEndDate();              //generate the end date for the report
        }

        public void GenerateTrendReport()   //calculations for all items in <reportData>
        {
            if (category == null) { throw new Exception("noCategory"); }
            if (startDate == null) { GenerateStartDate(); }         //genearte the start date (if none was specified)
            if (endDate == null) { GenerateEndDate(); }             //generate the end date (if none was specified)

            GetTrendItems(category);        //add all items in the category to <reportData>
            GetMonthList();                 //build a list of months the report encompasses

            for (int i=0; i<reports.Count; i++)
            {
                TrendReportData trd = reports[i];           //shorten name for convenience
                trd = RetrieveMonthlyRequests(trd);         //get the monthly and total requests
                trd = CalculateMeans(trd);                  //calculate mean x and y values
                trd.Slope = CalculateSlope(trd);            //calculate slope
                trd.YIntercept = CalculateYIntercept(trd);  //calculate y-intercept
                reports[i] = trd;                           //update the actual TrendReportData
            }
        }

        private bool VerifyStartDate(DateTime toVerify)  //verify the startDate is at least 2mo prior to current date
        {
            DateTime currentDate = DateTime.Now;
            if (currentDate.Year >= toVerify.Year && currentDate.Month - toVerify.Month >= 2) { return true; }
            if (currentDate.Year > toVerify.Year && (currentDate.Month+12) - toVerify.Month >=2) { return true; }
            return false;
        }

        private bool VerifyEndDate(DateTime toVerify)   //verify (startDate < endDate) & (endDate-startDate <= monthRange)
        {
            int monthsBetween = endDate.Month - startDate.Month;
            int yearsBetween = endDate.Year - startDate.Year;
            int gap = 1;
            if (yearsBetween >= gap) { monthsBetween += 12 * yearsBetween;  }
            else if (monthsBetween < gap) { return false; }

            if (monthsBetween > monthRange) { return false; }
            monthRange = monthsBetween;
            return true;
        }

        private void GenerateStartDate()//if no startDate was specified, get one <monthRange> ago 
        {
            int startMonth = DateTime.Today.Month - monthRange;
            int startYear = DateTime.Today.Year;
            if (startMonth < 1)     //if the startMonth is negative, it is from last prior year
            {
                startMonth += 12;   //make startMonth positive
                startYear -= 1;     //make startYear last year
            }
            startDate = new DateTime(startYear, startMonth, 1);
        }

        private void GenerateEndDate()  //generates the endDate <monthRange> from the startDate
        {
            DateTime currentDate = DateTime.Now;
            int monthsBetween = currentDate.Month - startDate.Month;    //months between startDate and current date
            if (currentDate.Year > startDate.Year) { monthsBetween += 12; }
            if (monthRange > monthsBetween) { monthRange = monthsBetween; }

            int endMonth = startDate.Month + monthRange-1;
            int endYear = startDate.Year;
            if (endMonth > 12)      //if the endMonth is greater than 12, then it is in the next year
            {
                endMonth -= 12;     //make endMonth a valid month
                endYear += 1;       //make endYear the next year
            }

            endDate = new DateTime(endYear, endMonth, 1);
        }

        private void GetTrendItems(ItemCategory category)   //adds all items in <category> to <reportData>
        {
            SqlParameter parameter = new SqlParameter("@item_category", category.CategoryName);
            SqlDataReader reader = DBConnection.executeSelectProcedure("SelectDefaultItemsByCategory", parameter);
            while (reader.Read())
            {
                Item itm = new Item(reader.GetString(0), category.CategoryName);
                if (itm.ItemName == "Other") { continue; }
                reports.Add(new TrendReportData { TrendItem = itm });
            }
        }

        private void GetMonthList()     //generates the string name of all months between <startDate> and <endDate>
        {
            List<string> months = new List<string>();
            months.Add("January"); months.Add("February"); months.Add("March");
            months.Add("April"); months.Add("May"); months.Add("June"); months.Add("July");
            months.Add("August"); months.Add("September"); months.Add("October"); months.Add("November");
            months.Add("December");
            int i = 0;
            int startMonthNum = StartDate.Month - 1;    //0 <= startMonthNum < 12
            while (i < monthRange)
            {
                int monthNum = (startMonthNum + i) % 12;
                monthNames.Add(months[monthNum]);
                i++;
            }
        }

        private TrendReportData RetrieveMonthlyRequests(TrendReportData trd)  //fills the <monthlyRequests> and <totalRequests> vars for <trd>
        {
            TrendReportData updatedTRD = trd;
            List<SqlParameter> parameters = new List<SqlParameter>();
            SqlDataReader reader;

            if (trd.TrendItem.ItemName.ToLower() == "other")
            {
                parameters.Add(new SqlParameter("@startDate", startDate));
                parameters.Add(new SqlParameter("@endDate", endDate));
                reader = DBConnection.executeSelectProcedure("SelectMonthlyRequestsStudent", parameters); //returns the total requests for <trendItem> by month
            }

            else
            {
                parameters.Add(new SqlParameter("@item", trd.TrendItem.ItemName));
                parameters.Add(new SqlParameter("@category", category.CategoryName));
                parameters.Add(new SqlParameter("@startDate", startDate));
                parameters.Add(new SqlParameter("@endDate", endDate));
                reader = DBConnection.executeSelectProcedure("SelectMonthlyRequests", parameters); //returns the total requests for <trendItem> by month
            }

            while (reader.Read())
            {
                int requestAmount = reader.GetInt32(0);
                updatedTRD.MonthlyRequests.Add(requestAmount);  //add the monthly request amount to list
                updatedTRD.TotalItemRequests += requestAmount;  //update the total request amount (for item)
                totalRequests += requestAmount;                 //update the total request amount (for category)
                if (requestAmount > maxRequestAmount) { maxRequestAmount = requestAmount; }

            }
            return updatedTRD;
        }

        private TrendReportData CalculateMeans(TrendReportData trd) //calculate mean x and y values
        {
            TrendReportData updatedTRD = trd;
            double meanX = 0;
            double meanY = 0;
            for (int i = 1; i <= trd.MonthlyRequests.Count(); i++)
            {
                meanX += i;
                meanY += trd.MonthlyRequests[i - 1];
            }
            meanX /= trd.MonthlyRequests.Count();
            meanY /= trd.MonthlyRequests.Count();
            updatedTRD.MeanX = meanX;
            updatedTRD.MeanY = meanY;
            return updatedTRD;
        }

        private double CalculateSlope(TrendReportData trd)          //calculates the slope of the trendline
        {
            double numerator = 0;       //summation{(x<sub>i - meanX)*(y<sub>i - meanY)}
            double denominator = 0;     //summation{(x<sub>i - meanX)^2}

            //calculate summations
            for (int i = 0; i < trd.MonthlyRequests.Count(); i++)
            {
                double numeratorX = (i + 1) - trd.MeanX;
                double numeratorY = (trd.MonthlyRequests[i] - trd.MeanY);
                numerator += numeratorX * numeratorY;
                denominator += numeratorX * numeratorX;
            }
            return numerator / denominator;
        }

        private double CalculateYIntercept(TrendReportData trd)     //calculate the y-intercept from the slope and mean values
        {
            return (trd.MeanY - (trd.Slope * trd.MeanX));   //YIntercept = meanY - (slope)*(meanX)
        }
    }

    public class TRPixelData
    {
        public Point pixelLocation { get; set; }
        public Color pixelColor { get; set; }
    }

    public class TrendLine : IEquatable<TrendLine>, IComparable<TrendLine>
    {
        public PointF startPoint { get; set; }
        public PointF endPoint { get; set; }
        public TrendLine() { }
        public TrendLine(PointF startPoint, PointF endPoint)
        {
            this.startPoint = startPoint;
            this.endPoint = endPoint;
        }

        public override string ToString()
        {
            return String.Format("Startpoint: {0}\tEndpoint: {1}", startPoint.ToString(), endPoint.ToString());
        }

        public override bool Equals(object obj)
        {
            if (obj == null) return false;
            TrendLine objAsTrendLine = obj as TrendLine;
            if (objAsTrendLine == null) return false;
            else return Equals(objAsTrendLine);
        }

        public bool Equals(TrendLine line)
        {
            if (!(this.startPoint == line.startPoint) || !(this.endPoint == line.endPoint)) return false;
            return true;
        }

        public static bool operator ==(TrendLine lineA, TrendLine lineB)
        {
            if (!(lineA.startPoint == lineB.startPoint) || !(lineA.endPoint == lineB.endPoint)) return false;
            return true;
        }

        public static bool operator !=(TrendLine lineA, TrendLine lineB)
        {
            if (lineA.startPoint == lineB.startPoint && lineA.endPoint == lineB.endPoint) return false;
            return true;
        }

        public override int GetHashCode()
        {
            return base.GetHashCode();
        }

        public int CompareTo(TrendLine compareLine)
        {
            if (compareLine.startPoint == null || compareLine.endPoint == null) return 1;  //this TrendLine is greater
            double thisSlope = (endPoint.Y - startPoint.Y) / (endPoint.X - startPoint.X);
            double compSlope = (compareLine.endPoint.Y - compareLine.startPoint.Y) / 
                (compareLine.endPoint.X - compareLine.startPoint.X);

            return thisSlope.CompareTo(compSlope);
        }

    }

    public class TrendSketcher
    {
        private TrendReport reportData;
        private string itemCategory;
        private string imageName = "trendReport.bmp";
        private string imagePath;
        private ImageFormat imageFormat = ImageFormat.Bmp;
        private Bitmap reportImage;

        private int imageWidth = 1280;
        private int imageHeight = 720;
        private int xPaddingLeft;
        private int xPaddingRight;
        private int yPadding;
        private int ySegments = 4;
        private int defaultFontSize = 24;
        private string defaultFontFamily = "Arial";
        private Color defaultFontColor;
        private List<Color> trendLineColors = new List<Color>();
        private Graphics reportGraphics;
        public TrendSketcher()
        {
            GetTrendColors();
            xPaddingLeft = imageWidth / 16;
            xPaddingRight = xPaddingLeft * 4;
            yPadding = xPaddingLeft;

            imagePath = Directory.GetCurrentDirectory() + "\\" + imageName;
            reportImage = new Bitmap(imageWidth, imageHeight);
            reportGraphics = Graphics.FromImage(reportImage);
            reportGraphics.SmoothingMode = SmoothingMode.AntiAlias;
            reportGraphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            reportGraphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        }

        public TrendSketcher(TrendReport reportData)
        {
            GetTrendColors();
            xPaddingLeft = imageWidth / 16;
            xPaddingRight = xPaddingLeft * 4;
            yPadding = xPaddingLeft;

            this.reportData = reportData;
            itemCategory = reportData.Category.CategoryName;
            reportImage = new Bitmap(imageWidth, imageHeight);
            reportGraphics = Graphics.FromImage(reportImage);
            reportGraphics.SmoothingMode = SmoothingMode.AntiAlias;
            reportGraphics.InterpolationMode = InterpolationMode.HighQualityBicubic;
            reportGraphics.PixelOffsetMode = PixelOffsetMode.HighQuality;
        }

        public void GetTrendColors(List<Color> colors = null)
        {
            if (colors != null)
            {
                trendLineColors = colors;
                return;
            }

            trendLineColors.Clear();
            ColorConverter cv = new ColorConverter();

            try
            {
                defaultFontColor = (Color)cv.ConvertFromString("DarkGreen");      //default font color

                //trend line colors
                trendLineColors.Add((Color)cv.ConvertFromString("DarkGoldenRod"));
                trendLineColors.Add((Color)cv.ConvertFromString("Blue"));
                trendLineColors.Add((Color)cv.ConvertFromString("Magenta"));
                trendLineColors.Add((Color)cv.ConvertFromString("Purple"));
                trendLineColors.Add((Color)cv.ConvertFromString("Brown"));
                trendLineColors.Add((Color)cv.ConvertFromString("DarkMagenta"));
                trendLineColors.Add((Color)cv.ConvertFromString("LimeGreen"));
                trendLineColors.Add((Color)cv.ConvertFromString("BlueViolet"));
                trendLineColors.Add((Color)cv.ConvertFromString("Green"));
                trendLineColors.Add((Color)cv.ConvertFromString("DarkGray"));
                trendLineColors.Add((Color)cv.ConvertFromString("DeepSkyBlue"));
                trendLineColors.Add((Color)cv.ConvertFromString("DeepPink"));
                trendLineColors.Add((Color)cv.ConvertFromString("DarkBlue"));
                trendLineColors.Add((Color)cv.ConvertFromString("ForestGreen"));
            }
            catch (NotSupportedException e)
            {
                throw (e);
            }

        }
        public void SketchImage()
        {
            if (imagePath == null) { imagePath = @"C:\Users\Public\Documents\" + imageName; }
            if (reportData == null) { throw new Exception("noReportData"); }
            DrawBackground();
            DrawItemLabels();
            DrawAxes();
            DrawTrendLines();
            DrawLegend();

            if (File.Exists(imagePath))
            {
                File.Delete(imagePath);
            }
            reportImage.Save(imagePath, imageFormat);
        }

        private void DrawBackground(int borderWidth = 3, string borderColor = "Gray", string backgroundColor = "WhiteSmoke")
        {
            Color brdrColor;
            Color bckColor;
            try
            {
                ColorConverter cv = new ColorConverter();
                brdrColor = (Color)cv.ConvertFromString(borderColor);
                bckColor = (Color)cv.ConvertFromString(backgroundColor);
            }
            catch (NotSupportedException e)
            {
                throw (e);
            }


            //draw the border
            Brush border = new SolidBrush(brdrColor);
            reportGraphics.FillRectangle(border, 0, 0, imageWidth, imageHeight);
            
            //draw inner background
            Brush background = new SolidBrush(bckColor);
            reportGraphics.FillRectangle(background, borderWidth, borderWidth, imageWidth - (borderWidth*2), imageHeight - (borderWidth*2));
        }

        private void DrawItemLabels()
        {
            int initialX = imageWidth / 8;    //initial itemcategory rectangle x value
            int initialY = imageHeight / 20;  //initial rectangles y value
            int rectangleWidth = imageWidth / 4;
            int rectangleVerticalPadding = 15;
            int rectangleHeight;

            //get the string to draw the category/itemname label in the top left of the image
            string categoryLabel = "Category: " + FirstCharToUpper(itemCategory);

            //get the string to draw the total request amount in the top right of the image
            string requestLabel = "Disbursements: " + reportData.TotalRequests;
            Font font = new Font(defaultFontFamily, Math.Min(GetItemFont(categoryLabel, defaultFontSize, rectangleWidth),
                GetItemFont(requestLabel, defaultFontSize, rectangleWidth)));   //get the max font that will fit in both rectangles

            //draw rectangle borders
            rectangleHeight = Convert.ToInt32(font.Size) + rectangleVerticalPadding;
            RectangleF itemRectangle = new RectangleF(initialX, initialY, rectangleWidth, rectangleHeight);
            RectangleF requestRectangle = new RectangleF((imageWidth - initialX - rectangleWidth), initialY, rectangleWidth, rectangleHeight);
            Pen ballpoint = new Pen(Color.Black);
            reportGraphics.DrawRectangle(ballpoint, initialX, initialY, rectangleWidth, rectangleHeight);
            reportGraphics.DrawRectangle(ballpoint, (imageWidth - initialX - rectangleWidth), initialY, rectangleWidth, rectangleHeight);

            //finally, draw the labels
            reportGraphics.DrawString(categoryLabel, font, new SolidBrush(defaultFontColor), itemRectangle);
            reportGraphics.DrawString(requestLabel, font, new SolidBrush(defaultFontColor), requestRectangle);
        }

        private void DrawAxes()
        {

            DrawAxesLines();
            DrawAxesLabels();
            DrawXAxisSegments();
            DrawYAxisSegments();
        }

        private void DrawAxesLines()
        {
            Pen ballpoint = new Pen(Color.Black);
            Brush paintbrush = new SolidBrush(Color.Black);

            //draw the axes line segments
            PointF origin = new PointF(xPaddingLeft, imageHeight - yPadding);
            PointF yAxisEnd = new PointF(xPaddingLeft, yPadding * 2);
            PointF xAxisEnd = new PointF(imageWidth - xPaddingRight, imageHeight - yPadding);
            reportGraphics.DrawLine(ballpoint, origin, yAxisEnd);
            reportGraphics.DrawLine(ballpoint, origin, xAxisEnd);

            //draw the axes line arrows
            int arrowHeightOffset = 10;
            int arrowWidthOffset = 6;
            PointF[] yArrow = new PointF[3];
            PointF[] xArrow = new PointF[3];

            yArrow[0] = new PointF(yAxisEnd.X - arrowWidthOffset, yAxisEnd.Y + arrowHeightOffset);     //the leftmost part of the y-arrow
            yArrow[1] = new PointF(yAxisEnd.X, yAxisEnd.Y);   //the tip of the y-arrow
            yArrow[2] = new PointF(yAxisEnd.X + arrowWidthOffset, yAxisEnd.Y + arrowHeightOffset);   //the rightmost part of the y-arrow

            xArrow[0] = new PointF(xAxisEnd.X - arrowHeightOffset, xAxisEnd.Y - arrowWidthOffset);     //the topmost part of the x-arrow
            xArrow[1] = new PointF(xAxisEnd.X, xAxisEnd.Y);     //the middle part of the x-arrow
            xArrow[2] = new PointF(xAxisEnd.X - arrowHeightOffset, xAxisEnd.Y + arrowWidthOffset);     //the bottom part of the x-arrow

            reportGraphics.FillPolygon(paintbrush, yArrow);
            reportGraphics.FillPolygon(paintbrush, xArrow);
        }

        private void DrawAxesLabels()
        {
            Brush axesBrush = new SolidBrush(defaultFontColor);
            Font yAxesFont = new Font(defaultFontFamily, defaultFontSize);
            Font xAxesFont = new Font(defaultFontFamily, defaultFontSize);

            //draw the y-axis label
            string yAxisLabel = "Requests";
            StringFormat verticalFormat = new StringFormat();
            verticalFormat.FormatFlags = StringFormatFlags.DirectionVertical;
            int yLabelHeight = xPaddingLeft / 2;            //the height available for the y-axis label
            while (yAxesFont.Height >= yLabelHeight)        //ensure the label fits in the available height
            {
                float newFontSize = yAxesFont.Size - 1;
                yAxesFont = new Font(yAxesFont.FontFamily, newFontSize);
            }
            int yLabelLength = Convert.ToInt32(reportGraphics.MeasureString(yAxisLabel, yAxesFont).Width);
            PointF yAxisLabelPoint = new PointF(yLabelHeight - yAxesFont.Height, (imageHeight / 2) - (yLabelLength / 2));
            reportGraphics.DrawString(yAxisLabel, yAxesFont, axesBrush, yAxisLabelPoint, verticalFormat);

            //draw the x-axis label
            string xAxisLabel = "Months";
            int xLabelHeight = xPaddingLeft / 2;            //the height available for the x-axis label
            while (xAxesFont.Height >= xLabelHeight)        //ensure the label fits in the available height
            {
                float newFontSize = xAxesFont.Size - 1;
                xAxesFont = new Font(xAxesFont.FontFamily, newFontSize);
            }
            int xLabelLength = Convert.ToInt32(reportGraphics.MeasureString(xAxisLabel, xAxesFont).Width);
            PointF xAxisLabelPoint = new PointF(((imageWidth + xPaddingLeft - xPaddingRight) / 2) - (xLabelLength / 2), (imageHeight - yPadding / 2));
            reportGraphics.DrawString(xAxisLabel, xAxesFont, axesBrush, xAxisLabelPoint);
        }

        private void DrawXAxisSegments(int segmentLength = 10)
        {
            //draw unit segments/measurements
            Brush axesBrush = Brushes.Black;
            Pen ballpoint = new Pen(axesBrush);

            int monthSegmentAmount = reportData.MonthRange; //amount of segments to draw
            int xAxisLength = imageWidth - (xPaddingLeft + xPaddingRight);
            int monthSegmentSpacing = xAxisLength / (monthSegmentAmount - 1);   //spacing between segments
            int monthLabelLength = monthSegmentSpacing / 2;                     //segment label length
            string longestMonth = GetLongestMonthName();                        //longest segment label  size
            int yOffset = yPadding / 6;                                         //y-offset between segment and label
            Font font = new Font(defaultFontFamily, GetItemFont(longestMonth, Convert.ToInt32(defaultFontSize*0.75), monthLabelLength));  //get the largest font that will fit in the segment label

            for (int i = 0; i < monthSegmentAmount; i++)
            {
                //draw segment on x-axis
                int xLocation = xPaddingLeft + (monthSegmentSpacing * i);
                int yLocationA = imageHeight - (yPadding - segmentLength / 2);
                int yLocationB = imageHeight - (yPadding + segmentLength / 2);
                Point segmentStart = new Point(xLocation, yLocationA);
                Point segmentEnd = new Point(xLocation, yLocationB);
                reportGraphics.DrawLine(ballpoint, segmentStart, segmentEnd);

                //draw segment label
                int xLabelOffset = Convert.ToInt32(reportGraphics.MeasureString(reportData.MonthNames[i], font).Width);
                xLabelOffset /= 2;
                PointF segmentLabel = new PointF(xLocation - xLabelOffset, yLocationB + yOffset);
                reportGraphics.DrawString(reportData.MonthNames[i], font, axesBrush, segmentLabel);
            }
        }

        private void DrawYAxisSegments(int segmentLength = 10)
        {
            //draw unit segments/measurements
            Brush axesBrush = Brushes.Black;
            Pen ballpoint = new Pen(axesBrush);

            int yAxisHeight = imageHeight - (yPadding * 3);
            int requestSegmentSpacing = yAxisHeight / (ySegments + 1);   //vertical spacing between segments
            int requestLabelLength = xPaddingLeft / 2;                  //length allowed for segment label
            int requestMax = reportData.MaxRequestAmount;
            string longestRequestAmount = requestMax.ToString();
            double defaultValue = (double)requestMax / (double)ySegments;
            List<string> segmentLabels = new List<string>();
            for (int i = 1; i <= ySegments; i++)         //store labels, track longest label size
            {
                string label = (i * defaultValue).ToString();
                if (label.Length > longestRequestAmount.Length) { longestRequestAmount = label; }
                segmentLabels.Add(label);
            }
            Font font = new Font(defaultFontFamily, GetItemFont(longestRequestAmount, defaultFontSize, requestLabelLength));

            for (int i = 1; i < ySegments + 1; i++)
            {
                //draw segment on axis (bottom to top)
                int xLocationA = xPaddingLeft - segmentLength / 2;
                int xLocationB = xPaddingLeft + segmentLength / 2;
                int yLocation = (imageHeight - yPadding) - (requestSegmentSpacing * i);
                Point segmentStart = new Point(xLocationA, yLocation);
                Point segmentEnd = new Point(xLocationB, yLocation);
                reportGraphics.DrawLine(ballpoint, segmentStart, segmentEnd);

                //draw segment label
                int yLabelOffset = font.Height / 2;
                int xLabelOffset = Convert.ToInt32(reportGraphics.MeasureString(segmentLabels[i - 1], font).Width);
                PointF segmentLabel = new PointF(xLocationA - xLabelOffset, yLocation - yLabelOffset);
                reportGraphics.DrawString(segmentLabels[i - 1], font, axesBrush, segmentLabel);
            }
        }

        private void DrawTrendLines(int lineThickness = 3)
        {
            List<TrendLine> sortedTLData = GetTrendLineData();
            sortedTLData.Sort();
            float maxDashLength = (imageWidth - (xPaddingLeft + xPaddingRight)) / 8;
            float minDashLength = 5;
            float dashLength = maxDashLength;
            int lineAmount = sortedTLData.Count;

            for (int i=0; i<lineAmount; i++)
            {
                TrendLine line = sortedTLData[i];
                Color color = trendLineColors[i % trendLineColors.Count];
                Pen ballpoint = new Pen(color, lineThickness); 
                if (i > 0 && sortedTLData[i-1] == line)
                {
                    ballpoint.DashPattern = new float[] { dashLength, dashLength };
                    dashLength = (float) (dashLength * 0.5);
                    if (dashLength < minDashLength) dashLength = maxDashLength;
                }
                else { dashLength = maxDashLength; }

                reportGraphics.DrawLine(ballpoint, sortedTLData[i].startPoint, sortedTLData[i].endPoint);
            }
        }

        private List<TrendLine> GetTrendLineData()
        {
            List<TrendLine> tlData = new List<TrendLine>();
            double xStart = xPaddingLeft;                       //x-axis start location
            double xEnd = imageWidth - xPaddingRight;           //x-axis end location
            double xDistance = xEnd - xStart;                   //x-axis length
            double xEquiv = reportData.MonthNames.Count;        //the size of the x-axis in the report
            double xRatio = xDistance / (xEquiv - 1);           //the ratio used to scale the report x-axis to image x-axis

            double yStart = imageHeight - yPadding;
            double yEnd = yPadding * 2;
            double yDistance = (yStart - yEnd) * ((double)ySegments / (double)(ySegments + 1));
            double yEquiv = reportData.MaxRequestAmount;
            double yRatio = yDistance / yEquiv;

            for (int i = 0; i < reportData.Reports.Count; i++)
            {
                TrendReportData trd = reportData.Reports[i];

                double b = trd.YIntercept;
                double m = trd.Slope;
                double x1 = 1;
                double x2 = trd.MonthlyRequests.Count;
                double y1 = (m * x1) + b;
                double y2 = (m * x2) + b;

                if (y1 < 0) //adjust for negative y-intercept
                {
                    x1 = 0 - b / m;
                    y1 = 0;
                }

                if (y2 < 0) //adjust for negative y endpoint
                {
                    x2 = 0 - b / m;
                    y2 = 0;
                }

                double xPtStart = xStart + ((x1 - 1) * xRatio);   //x1 pixel location
                double xPtEnd = xStart + ((x2 - 1) * xRatio);     //x2 pixel location
                double yPtStart = yStart - (y1 * yRatio);       //y1 pixel location
                double yPtEnd = yStart - (y2 * yRatio);         //y2 pixel location

                PointF lineStart = new PointF(Convert.ToInt32(xPtStart), Convert.ToInt32(yPtStart));
                PointF lineEnd = new PointF(Convert.ToInt32(xPtEnd), Convert.ToInt32(yPtEnd));
                tlData.Add(new TrendLine(lineStart, lineEnd));
            }


            return tlData;
        }

        private void DrawLegend()
        {
            double legendXPadding = (xPaddingLeft / 2);     //spacing between legend and graph/image edge
            double legendYPadding = (yPadding * 2);         //spacing between legend and header
            double xStart = (imageWidth - xPaddingRight) + legendXPadding;  //x-location for drawing labels
            double xEnd = imageWidth - legendXPadding;
            double yStart = legendYPadding;                 //first y-location for drawing labels
            double yEnd = imageHeight - legendYPadding;     //last possible y-location for drawing labels
            double legendHeight = yEnd - yStart;

            double itemCount = reportData.Reports.Count;
            double verticalSize = legendHeight / itemCount; //max height the text can be to fit all items in legend
            double horizontalSize = xEnd - xStart;          //max width the text...
            string longestItem = GetLongestItemName() + ": " + (reportData.MaxRequestAmount*reportData.MonthRange).ToString();
            Font font = new Font(defaultFontFamily, GetItemFont(longestItem, defaultFontSize,
                Convert.ToInt32(horizontalSize), Convert.ToInt32(verticalSize)));
            double elementHeight = font.Height * 1.25;      //actual height adjusted for spacing 

            //draw text for each item
            for (int i=0; i<reportData.Reports.Count; i++)
            {
                double y = yStart + (i * elementHeight);
                PointF p = new PointF(Convert.ToInt32(xStart), Convert.ToInt32(y));
                TrendReportData trd = reportData.Reports[i];
                string s = trd.TrendItem.ItemName + ": " + trd.TotalItemRequests;
                Brush brush = new SolidBrush(trendLineColors[i%trendLineColors.Count]);
                reportGraphics.DrawString(s, font, brush, p);
            }
        }

        private string GetLongestMonthName()    //getst the longest month name in the TrendReport
        {
            string longestMonth = "";
            for (int i=0; i<reportData.MonthNames.Count; i++)
            {
                if (reportData.MonthNames[i].Length > longestMonth.Length) { longestMonth = reportData.MonthNames[i]; }
            }
            return longestMonth;
        }

        private string GetLongestItemName() //gets the longest item name in the TrendReport
        {
            string longestItem = "";
            for (int i=0; i<reportData.Reports.Count; i++)
            {
                string itemName = reportData.Reports[i].TrendItem.ItemName;
                if (itemName.Length > longestItem.Length) { longestItem = itemName; }
            }
            return longestItem;
        }

        private string FirstCharToUpper(string s)   //capitalizes the first char of the string
        {
            if (s.Length < 1) { return ""; }
            if (s.Length == 1) { return s[0].ToString().ToUpper(); }
            return (s[0].ToString().ToUpper() + s.Substring(1));
        }

        private int GetItemFont(string label, int fontSize, int maxWidth)   //returns the max font size that will allow <label> to fit inside <maxWidth>
        {
            while (reportGraphics.MeasureString(label, new Font(defaultFontFamily, fontSize)).Width > maxWidth)
            {
                fontSize--;
            }
            return fontSize;
        }

        private int GetItemFont(string label, int fontSize, int maxWidth, int maxHeight)
        {
            SizeF currSize = reportGraphics.MeasureString(label, new Font(defaultFontFamily, fontSize));
            while (currSize.Width > maxWidth || currSize.Height > maxHeight)
            {
                fontSize--;
                currSize = reportGraphics.MeasureString(label, new Font(defaultFontFamily, fontSize));
            }
            return fontSize;
        }
    }
}
