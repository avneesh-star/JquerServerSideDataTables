namespace API.Errors
{
    public class ApiException
    {
        public ApiException(string sStatusCode, string sMessage = "" , string sDetails="")
        {
            StatusCode = sStatusCode;    
            Message = sMessage;
            Details = sDetails;
        }

        public string StatusCode { get; set; }
        public string Message { get; set; }
         public string Details { get; set; }
    }
}