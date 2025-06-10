export const fetchPost = async () => {
    
    try {
        const res = await fetch('https://jsonplaceholder.typicode.com/posts');
        if (!res.ok) throw new Error("Faile to fetch API");
        return await res.json();
    } catch (err) {
        console.log("Fetch Error!", err);
        return [];
    }
}