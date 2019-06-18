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
using System.Threading;
using System.Threading.Tasks;
using System.Timers;

namespace BackupSirius
{
    public partial class Service1 : ServiceBase
    {
        private bool active = true;
        //readonly Timer timer = new Timer();
        public Service1()
        {
            InitializeComponent();
        }


        protected override void OnStart(string[] args)
        {
            WriteLog("Serviço iniciado em " + DateTime.Now);
            active = true;
            Thread th = new Thread(Backup);
            th.Start();
            //timer.Elapsed += new ElapsedEventHandler(OnElapsedTime);
            //timer.Interval = int.Parse(ConfigurationManager.AppSettings["interval"]) * 1000; //number in miliseconds
            //timer.Enabled = true;
        }

        protected override void OnStop()
        {
            active = false;
            WriteLog("O Serviço foi interrompido às " + DateTime.Now);
        }

        //private void OnElapsedTime(object source, ElapsedEventArgs e)
        //{
        //    Backup();
        //}

        public void Backup()
        {
            try
            {
                while (active)
                {
                    WriteLog("Iniciando backup... " + DateTime.Now);
                    Process proc = new Process();
                    ProcessStartInfo startInfo = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        RedirectStandardOutput = true,
                        RedirectStandardInput = true
                    };
                    proc.StartInfo = startInfo;
                    proc.Start();

                    using (StreamWriter sw = proc.StandardInput)
                    {
                        if (sw.BaseStream.CanWrite)
                        {
                            foreach (var line in File.ReadAllLines(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "scripts-backup.txt")))
                            {
                                var novaLinha = line.Replace("\r", "");
                                sw.WriteLine(novaLinha);
                            }
                        }
                    }

                    string messageError = proc.StandardError.ReadToEnd();
                    string messageOutput = proc.StandardOutput.ReadToEnd();


                    WriteLog($"------------Standard Error - Backup------------\n{messageError}\n\n------------Standard Output - Backup------------\n{messageOutput}\n");

                    string scriptLog = File.ReadAllText(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "scripts-log.txt"));

                    proc = new Process();
                    startInfo = new ProcessStartInfo
                    {
                        FileName = "cmd.exe",
                        CreateNoWindow = true,
                        UseShellExecute = false,
                        RedirectStandardError = true,
                        RedirectStandardOutput = true,
                        RedirectStandardInput = true
                    };
                    proc.StartInfo = startInfo;
                    proc.Start();

                    using (StreamWriter sw = proc.StandardInput)
                    {
                        if (sw.BaseStream.CanWrite)
                        {
                            foreach (var line in scriptLog.Split('\n'))
                            {
                                var novaLinha = line.Replace("\r", "");
                                sw.WriteLine(novaLinha);
                            }
                        }
                    }

                    messageError = proc.StandardError.ReadToEnd();
                    messageOutput = proc.StandardOutput.ReadToEnd();

                    proc.WaitForExit();

                    WriteLog($"------------Standard Error - Log------------\n{messageError}\n\n------------Standard Output - Log------------\n{messageOutput}\n");
                    WriteLog("Backup finalizado: " + DateTime.Now);

                    AtualizaProjeto();
                    
                    Thread.Sleep(int.Parse(ConfigurationManager.AppSettings["interval"]) * 1000);
                }
            }
            catch (Exception e)
            {
                WriteLog($"Erro ao executar comando: {e.Message}{Environment.NewLine}{e.StackTrace}");
            }
        }

        public void AtualizaProjeto()
        {
            WriteLog("Baixando alterações do Projeto via Git.");

            Process proc = new Process();
            ProcessStartInfo startInfo = new ProcessStartInfo
            {
                FileName = "cmd.exe",
                CreateNoWindow = true,
                UseShellExecute = false,
                RedirectStandardError = true,
                RedirectStandardOutput = true,
                RedirectStandardInput = true
            };
            proc.StartInfo = startInfo;
            proc.Start();

            using (StreamWriter sw = proc.StandardInput)
            {
                sw.WriteLine("cd " + AppDomain.CurrentDomain.BaseDirectory);
                sw.WriteLine("cd..");
                sw.WriteLine("git pull");
            }

            string messageError = proc.StandardError.ReadToEnd();
            string messageOutput = proc.StandardOutput.ReadToEnd();


            WriteLog($"------------Standard Error - Git Pull------------\n{messageError}\n\n------------Standard Output - Git Pull------------\n{messageOutput}\n");
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
