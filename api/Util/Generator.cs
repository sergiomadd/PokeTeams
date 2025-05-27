using System.Numerics;
using System.Text;

namespace api.Util
{
    public static class Generator
    {
        private const string chars = "abcdefghijklmnopqrstuvwxyz0123456789";
        private const int baseSize = 36;

        public static string GenerateId(int length = 10)
        {
            Guid guid = Guid.NewGuid();
            byte[] bytes = guid.ToByteArray();
            BigInteger bigInt = new BigInteger(bytes);
            if (bigInt < 0) bigInt = BigInteger.Negate(bigInt);

            string base36String = Base36Encode(bigInt);

            if (base36String.Length < length)
            {
                base36String = base36String.PadLeft(length, 'a');
            }

            return base36String.Substring(0, length);
        }

        private static string Base36Encode(BigInteger value)
        {
            var sb = new StringBuilder();
            while (value > 0)
            {
                int remainder = (int)(value % baseSize);
                sb.Insert(0, chars[remainder]);
                value /= baseSize;
            }

            return sb.Length == 0 ? "a" : sb.ToString();
        }
    }
}
