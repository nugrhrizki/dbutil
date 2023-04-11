import { createEffect, createSignal } from "solid-js";
import "./App.css";

function App() {
  const [config, setConfig] = createSignal<Config>({
    host: "localhost",
    port: 5432,
    user: "postgres",
    name: "postgres",
    file_name: "backup.backup",
  });
  const [backup, setBackup] = createSignal<string>(
    create_backup_shell_cmd(config())
  );
  const [restore, setRestore] = createSignal<string>(
    create_restore_shell_cmd(config())
  );

  function handle_backup() {
    copy_to_clipboard(backup());
  }

  function handle_restore() {
    copy_to_clipboard(restore());
  }

  createEffect(() => {
    setBackup(create_backup_shell_cmd(config()));
    setRestore(create_restore_shell_cmd(config()));
  });

  return (
    <div class="container">
      <h1>Postgres Backup and Restore</h1>
      <div class="form_group">
        <label for="host">Host</label>
        <input
          type="text"
          id="host"
          value={config().host}
          onInput={(e) =>
            setConfig({ ...config(), host: e.currentTarget.value })
          }
        />
      </div>
      <div class="form_group">
        <label for="port">Port</label>
        <input
          type="number"
          id="port"
          value={config().port}
          onInput={(e) =>
            setConfig({ ...config(), port: Number(e.currentTarget.value) })
          }
        />
      </div>
      <div class="form_group">
        <label for="user">User</label>
        <input
          type="text"
          id="user"
          value={config().user}
          onInput={(e) =>
            setConfig({ ...config(), user: e.currentTarget.value })
          }
        />
      </div>
      <div class="form_group">
        <label for="name">Database Name</label>
        <input
          type="text"
          id="name"
          value={config().name}
          onInput={(e) =>
            setConfig({ ...config(), name: e.currentTarget.value })
          }
        />
      </div>
      <div class="form_group">
        <label for="file_name">File Name</label>
        <input
          type="text"
          id="file_name"
          value={config().file_name}
          onInput={(e) =>
            setConfig({ ...config(), file_name: e.currentTarget.value })
          }
        />
      </div>
      <div class="result">
        <h2>Result</h2>
        <div class="btn_group">
          <button onClick={handle_backup}>Copy</button>
          <p>
            <code>{backup()}</code>
          </p>
        </div>
        <div class="btn_group">
          <button onClick={handle_restore}>Copy</button>
          <p>
            <code>{restore()}</code>
          </p>
        </div>
      </div>
    </div>
  );
}

type Config = {
  host: string;
  port: number;
  user: string;
  name: string;
  file_name: string;
};

function create_backup_shell_cmd({
  host,
  port,
  user,
  name,
  file_name,
}: Config) {
  return `pg_dump -U ${user} -h ${host} -p ${port} -d ${name} --format=custom --compress=9 --file=${file_name}`;
}

function create_restore_shell_cmd({
  host,
  port,
  user,
  name,
  file_name,
}: Config) {
  return `pg_restore -U ${user} -h ${host} -p ${port} -d ${name} ${file_name}`;
}

function copy_to_clipboard(text: string) {
  navigator.clipboard.writeText(text);
  alert("Copied to clipboard");
}

export default App;
