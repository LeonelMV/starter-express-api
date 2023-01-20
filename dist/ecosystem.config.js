module.exports = {
    /**
     * Application configuration section
     * http://pm2.keymetrics.io/docs/usage/application-declaration/
     */
    apps: [
        // First application cron_restart: '0 0 * * *',
        {
            name: 'BinanceBOT',
            script: 'server.js',
            cwd: "./",
            node_args: "-r dotenv/config --max-old-space-size=16384",
            log_date_format: "YYYY-MM-DD HH:mm:ss",
            out_file: "./logs/out-0.log",
            error_file: "./logs/err-0.log",
            watch: true,
            exec_mode: "fork"
        },
    ]
};
