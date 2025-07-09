namespace CasaBackend.Casa.Application.Interfaces.Factory
{
    public interface IDeviceFactory<TEntity, TModel>
    {
        Task<TEntity> FabricDeviceAsync(TModel model);
    }
}
