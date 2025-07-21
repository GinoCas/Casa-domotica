const API_URL = process.env.EXPO_PUBLIC_API_URL;

const handleResponseError = (err: any): Result<any> =>
{
  console.log("Error: " + err);
  return Result.failure([err]);
}

const handleResponseValidation = async (response: Response): Promise<void> =>
{
  if(response.ok) { return }
  var errText = await response.text();
  throw new Error(errText);
}

export async function GetHandler<T>(route: string): Promise<Result<T>> {
  try{
    const response = await fetch(`${API_URL}/${route}`);
    await handleResponseValidation(response);
    const json = await response.json();
    return json as Result<T>;
  }catch(err: any){
    return handleResponseError(err);
  }
}

export async function PostHandler<T>(route: string, data: any): Promise<Result<T>> {
  try
  {
      const response = await fetch(`${API_URL}/${route}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await handleResponseValidation(response);
    const json = await response.json();
    return json as Result<T>
  } catch(err){
    return handleResponseError(err);
  }
}
