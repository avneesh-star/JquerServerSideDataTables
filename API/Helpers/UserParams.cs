namespace API.Helpers
{
    public class UserParams
    {
        private const int MaxPageSixe = 50;
        public int PageNumber { get; set; }=1;

        private int _pageSize = 10;
        public int PageSize 
        {
             get => _pageSize;
             set => _pageSize = (value > MaxPageSixe ? MaxPageSixe : value);
        }
      
    }
}