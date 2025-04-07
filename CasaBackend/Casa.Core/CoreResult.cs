namespace CasaBackend.Casa.Core
{
	public class CoreResult<T>
	{
		public List<T> Data = [];
		public string Code = string.Empty;
		public string Error = string.Empty;
		public string Alert = string.Empty;
	}
}
