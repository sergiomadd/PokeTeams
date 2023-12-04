using api.Models.DBModels;

namespace api.Models
{
    public class Effectiveness
    {
        public List<Tuple<string, double>>? AllValues { get; set; }
        public List<PokeType> DoubleSuperEffective { get; set; }
        public List<PokeType> SuperEffective { get; set; }
        public List<PokeType> NotVeryEffective { get; set; }
        public List<PokeType> DoubleNotVeryEffective { get; set; }
        public List<PokeType> Inmune { get; set; }

        public Effectiveness(List<Tuple<string, double>> allValues)
        {
            DoubleSuperEffective = new List<PokeType>();
            SuperEffective = new List<PokeType>();
            NotVeryEffective = new List<PokeType>();
            DoubleNotVeryEffective= new List<PokeType>();
            Inmune = new List<PokeType>();

            AllValues = allValues;
            if(AllValues != null)
            {
                foreach (var value in AllValues)
                {
                    switch (value.Item2)
                    {
                        case 4:
                            DoubleSuperEffective.Add(new PokeType(value.Item1, value.Item1));
                            break;
                        case 2:
                            SuperEffective.Add(new PokeType(value.Item1, value.Item1));
                            break;
                        case 0.5:
                            NotVeryEffective.Add(new PokeType(value.Item1, value.Item1));
                            break;
                        case 0.25:
                            DoubleNotVeryEffective.Add(new PokeType(value.Item1, value.Item1));
                            break;
                        case 0:
                            Inmune.Add(new PokeType(value.Item1, value.Item1));
                            break;
                    }
                }
            }



        }
    }
}
