        // Динамическая загрузка Firebase SDK (не блокирует запуск игры на iPhone / Safari / Quick Look)
        async function loadFirebaseModulesSafely() {
            const dynamicImport = new Function('u', 'return import(u)');
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Firebase SDK timeout')), 4500)
            );
            const [appMod, authMod, fsMod] = await Promise.race([
                Promise.all([
                    dynamicImport("https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js"),
                    dynamicImport("https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js"),
                    dynamicImport("https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js")
                ]),
                timeoutPromise
            ]);
            return {
                initializeApp: appMod.initializeApp,
                getAuth: authMod.getAuth,
                signInAnonymously: authMod.signInAnonymously,
                signInWithCustomToken: authMod.signInWithCustomToken,
                createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
                signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
                signOut: authMod.signOut,
                onAuthStateChanged: authMod.onAuthStateChanged,
                getFirestore: fsMod.getFirestore,
                doc: fsMod.doc,
                getDoc: fsMod.getDoc,
                setDoc: fsMod.setDoc,
                getDocs: fsMod.getDocs,
                runTransaction: fsMod.runTransaction,
                collection: fsMod.collection
            };
        }


