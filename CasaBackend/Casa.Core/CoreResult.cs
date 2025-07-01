namespace CasaBackend.Casa.Core
{
	public class CoreResult<T>
	{
		public List<T> Data = [];
		public bool Success = false;
		public string Message = "OK";
	}
}
