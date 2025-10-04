class KeyAuth {
    constructor(config) {
        this.name = config.name;
        this.ownerid = config.ownerid;
        this.version = config.version;
        this.url = "https://keyauth.win/api/1.2/";
        this.sessionid = null;
        this.initialized = false;
    }

    async initialize() {
        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    type: 'init',
                    name: this.name,
                    ownerid: this.ownerid,
                    version: this.version
                })
            });

            const data = await response.json();
            
            if (data.success) {
                this.sessionid = data.sessionid;
                this.initialized = true;
                return { success: true, message: "Application initialized successfully" };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Failed to connect to KeyAuth server" };
        }
    }

    async login(username, password) {
        if (!this.initialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    type: 'login',
                    username: username,
                    pass: password,
                    sessionid: this.sessionid,
                    name: this.name,
                    ownerid: this.ownerid
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: "Login successful", data: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Failed to connect to KeyAuth server" };
        }
    }

    async register(username, password, licenseKey) {
        if (!this.initialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    type: 'register',
                    username: username,
                    pass: password,
                    key: licenseKey,
                    sessionid: this.sessionid,
                    name: this.name,
                    ownerid: this.ownerid
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: "Registration successful", data: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Failed to connect to KeyAuth server" };
        }
    }

    async license(licenseKey) {
        if (!this.initialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    type: 'license',
                    key: licenseKey,
                    sessionid: this.sessionid,
                    name: this.name,
                    ownerid: this.ownerid
                })
            });

            const data = await response.json();
            
            if (data.success) {
                return { success: true, message: "License activation successful", data: data };
            } else {
                return { success: false, message: data.message };
            }
        } catch (error) {
            return { success: false, message: "Failed to connect to KeyAuth server" };
        }
    }

    async upgrade(username, licenseKey) {
        if (!this.initialized) {
            const initResult = await this.initialize();
            if (!initResult.success) {
                return initResult;
            }
        }

        try {
            const response = await fetch(this.url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    type: 'upgrade',
                    username: username,
                    key: licenseKey,
                    sessionid: this.sessionid,
                    name: this.name,
                    ownerid: this.ownerid
                })
            });

            const data = await response.json();
            
            return { success: data.success, message: data.message };
        } catch (error) {
            return { success: false, message: "Failed to connect to KeyAuth server" };
        }
    }
}