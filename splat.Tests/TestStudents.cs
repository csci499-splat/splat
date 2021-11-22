using splat.Models;

namespace splat.Tests
{
    public class TestStudents
    {
        public const int NUM_TEST_STUDENTS = 6;

        public static readonly Student Alice = new Student
        {
            StudentId = "7654321",
            Age = 20,
            OnMealPlan = false
        };

        public static readonly Student Bob = new Student
        {
            StudentId = "1234567",
            Age = 22,
            OnMealPlan = true
        };

        public static readonly Student Carter = new Student
        {
            StudentId = "7444443",
            Age = 27,
            OnMealPlan = false
        };

        public static readonly Student Denise = new Student
        {
            StudentId = "7443543",
            Age = 50,
            OnMealPlan = true
        };

        public static readonly Student Erin = new Student
        {
            StudentId = "7449943",
            Age = 18,
            OnMealPlan = true
        };

        public static readonly Student Frank = new Student
        {
            StudentId = "7411111",
            Age = 30,
            OnMealPlan = false
        };
    }
}
