// GÜVENLİK NOTU: Token'ı burada açık yazmak yerine giriş ekranında sormak daha güvenlidir.
// Ama hızlı çözüm için buraya ekleyebilirsin.
const GITHUB_CONFIG = {
    token: 'SENIN_GITHUB_TOKENIN',
    owner: 'GITHUB_KULLANICI_ADIN',
    repo: 'REPO_ADIN',
    path: 'data.json'
};

async function getCloudDB() {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    try {
        const response = await fetch(url, {
            headers: { 'Authorization': `token ${GITHUB_CONFIG.token}` }
        });
        const data = await response.json();
        // UTF-8 karakterlerini doğru çözmek için decodeURIComponent kullanıyoruz
        const content = decodeURIComponent(escape(atob(data.content)));
        return { json: JSON.parse(content), sha: data.sha };
    } catch (err) {
        console.error("Veri çekme hatası:", err);
        return { json: { users: [], records: [] }, sha: null };
    }
}

async function saveCloudDB(newData, sha) {
    const url = `https://api.github.com/repos/${GITHUB_CONFIG.owner}/${GITHUB_CONFIG.repo}/contents/${GITHUB_CONFIG.path}`;
    const content = btoa(unescape(encodeURIComponent(JSON.stringify(newData, null, 2))));

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${GITHUB_CONFIG.token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: "Veritabanı güncellendi",
            content: content,
            sha: sha
        })
    });
    return response.ok;
}
