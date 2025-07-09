namespace CasaBackend.Casa.Application.Interfaces.Presenter
{
    public interface IPresenter<TEntity, TOutput>
    {
        public TOutput Present(TEntity entity);
    }
}
