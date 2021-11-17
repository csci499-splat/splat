using splat.Models;

namespace splat.Tests
{
    public class TestStudents
    {
        public static readonly Student Bob = new Student
        {
            StudentId = "1234567",
            Age = 22,
            OnMealPlan = true
        };

        public static readonly Student Alice = new Student
        {
            StudentId = "7654321",
            Age = 20,
            OnMealPlan = false
        };
    }
}
