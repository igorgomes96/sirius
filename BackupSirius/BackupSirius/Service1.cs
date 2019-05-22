using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Configuration;
using System.Data;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.ServiceProcess;
using System.Text;
using System.Threading.Tasks;
using System.Timers;

namespace BackupSirius
{
    public partial class Service1 : ServiceBase
    {
        readonly Timer timer = new Timer();
        public Service1()
        {
            InitializeComponent();
        }


        protected override void OnStart(string[] args)
        {
            WriteLog("Service is started at " + DateTime.Now);

            timer.Elapsed += new ElapsedEventHandler(OnElapsedTime);
            timer.Interval = int.Parse(ConfigurationManager.AppSettings["interval"]) * 1000; //number in miliseconds
            timer.Enabled = true;
        }

        protected override void OnStop()
        {
            WriteLog("O Serviço foi interrompido às " + DateTime.Now);
        }

        private void OnElapsedTime(object source, ElapsedEventArgs e)
        {
            Backup();
            WriteLog("Backup finalizado: " + DateTime.Now);
        }

        public void Backup()
        {
            try
            {
                WriteLog("Iniciando backup... " + DateTime.Now);
                Process proc = new Process();
                ProcessStartInfo startInfo = new ProcessStartInfo
                {
                    WindowStyle = ProcessWindowStyle.Hidden,
                    CreateNoWindow = true,
                    UseShellExecute = false,
                    FileName = Path.Combine(Environment.SystemDirectory, "cmd.exe"),
                    RedirectStandardOutput = true,
                    RedirectStandardError = true,
                    RedirectStandardInput = true 
                };

                proc.StartInfo = startInfo;
                proc.Start();

                using (StreamWriter sw = proc.StandardInput)
                {
                    if (sw.BaseStream.CanWrite)
                    {
                        var fileName = Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "scripts.txt");
                        var lines = File.ReadAllLines(fileName);
                        foreach (var line in lines) 
                            sw.WriteLine(line);
                    }
                }

                proc.WaitForExit();

                string message = proc.StandardError.ReadToEnd();

                if (!string.IsNullOrEmpty(message))
                    WriteLog($"Log da execução: {Environment.NewLine}{message}");

            }
            catch (Exception e)
            {
                WriteLog($"Erro ao executar comando: {e.Message}{Environment.NewLine}{e.StackTrace}");
            }
        }

        /// <summary>
        /// Write log and returns wheter already exists the file for the current date or not.
        /// </summary>
        /// <param name="Message"></param>
        /// <returns></returns>
        public bool WriteLog(string Message)
        {
            string path = AppDomain.CurrentDomain.BaseDirectory + "\\Logs";
            if (!Directory.Exists(path))
            {
                Directory.CreateDirectory(path);
            }
            string filepath = AppDomain.CurrentDomain.BaseDirectory + "\\Logs\\ServiceLog_" + DateTime.Now.Date.ToShortDateString().Replace('/', '_') + ".txt";
            bool existsFile = File.Exists(filepath);
            if (!existsFile)
            {
                // Create a file to write to.
                using (StreamWriter sw = File.CreateText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
            else
            {
                using (StreamWriter sw = File.AppendText(filepath))
                {
                    sw.WriteLine(Message);
                }
            }
            return existsFile;
        }
    }
}
