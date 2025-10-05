namespace CasaBackend.Casa.Core.Entities.Capabilities
{
    public interface ICapabilityEntity
    {
        int Id { get; set; }
        DeviceEntity Device { get; set; }
    }

    public interface ICapabilityEntity<TSelf> : ICapabilityEntity where TSelf : class, ICapabilityEntity<TSelf>
    {
        CoreResult<bool> UpdateFrom(TSelf source);
    }
}
