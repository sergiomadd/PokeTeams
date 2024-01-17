namespace api.Util
{
    public static class Printer
    {
        public static void Log(object? value)
        {
            System.Diagnostics.Debug.WriteLine(value.ToString());
        }
        public static void Log(string message, object? value = null)
        {
            if(value != null)
            {
                System.Diagnostics.Debug.WriteLine(message + value.ToString());

            }
            System.Diagnostics.Debug.WriteLine(message);
        }
    }
}
