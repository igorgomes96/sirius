@echo off
@echo MANTENHA ESSA JANELA ABERTA ENQUANTO ESTIVER USANDO O SISTEMA LOCALMENTE.
@echo Em caso de erro na abertura do sistema no Chrome, aguarde alguns segundos e aperte F5...
@echo Utilize a instancia local do sistema apenas para consulta (em caso de indisponibilidade de rede). Qualquer dado gravado sera descartado no proximo backup.
node app | start chrome http://localhost:3000/