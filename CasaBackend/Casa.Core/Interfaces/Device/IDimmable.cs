namespace CasaBackend.Casa.Core.Interfaces.Device
{
    public interface IDimmable
    {
        int Brightness { get; set;  }
        int[] Limits { get; }
    }
}
