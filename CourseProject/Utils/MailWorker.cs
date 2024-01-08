using MailKit.Net.Smtp;
using MimeKit;

namespace CourseProject.Utils
{
    public static class MailWorker
    {
        private static string _email = "queue.poly.by@gmail.com";
        private static string _password = "ycaq alct oltt fyzk";
        public static async Task<bool> SendMessage(string email, string subject, string message)
        {
            try
            {
                using var emailMessage = new MimeMessage();
                emailMessage.From.Add(new MailboxAddress("QueuePoly", _email));
                emailMessage.To.Add(new MailboxAddress("", email));
                emailMessage.Subject = subject;
                emailMessage.Body = new TextPart() { Text = message };

                using (var client = new SmtpClient())
                {
                    await client.ConnectAsync("smtp.gmail.com", 587, false);
                    await client.AuthenticateAsync(_email, _password);
                    await client.SendAsync(emailMessage);
                    await client.DisconnectAsync(true);
                }
                return true;
            }
            catch
            {
                return false;
            }
        }
    }
}
