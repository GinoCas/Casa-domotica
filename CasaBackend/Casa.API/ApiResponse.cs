using Newtonsoft.Json;

namespace CasaBackend.Casa.API
{
	public class ApiResponse<T>
	{
		public List<T> Data = [];
		public bool Success = false;
		public string Message = "OK";
		public string ToJson() 
		{
			return JsonConvert.SerializeObject(this);
		}
	}
}
