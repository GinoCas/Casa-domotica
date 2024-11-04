using Newtonsoft.Json;

namespace CasaAPI.Utils.Responses
{
	public class Response<T>
	{
		public List<T> data;
		public string cdRes;
		public string dsRes;
		public List<string> errors;
		public List<string> alerts;
		public Response()
		{
			data = new List<T>();
			cdRes = "OK";
			dsRes = "";
			errors = new List<string>();
			alerts = new List<string>();
		}
		public string Json()
		{
			return JsonConvert.SerializeObject(this, Formatting.Indented);
		}
	}
}
