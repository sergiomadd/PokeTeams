namespace api.Util
{
    /*
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
    */

    public class Printer
    {
        private readonly ILogger<Printer> _logger;

        public Printer(ILogger<Printer> logger)
        {
            _logger = logger;
        }

        public void Log(object? value)
        {
            _logger.LogInformation(value?.ToString());
        }

        public void Log(string message, object? value = null)
        {
            if (value != null)
            {
                _logger.LogInformation(message + value.ToString());
            }
            else
            {
                _logger.LogInformation(message);
            }
        }
    }
}
