namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public interface ICapabilityEntity<TSelf> where TSelf : class, ICapabilityEntity<TSelf>
    {
        int Id { get; set; }
        CoreResult<bool> UpdateFrom(TSelf source);
    }
}
