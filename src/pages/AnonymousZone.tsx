import { useState, useEffect } from 'react';
import { MessageSquare, Heart, Share2, MoreHorizontal, Send, ShieldAlert } from 'lucide-react';
import { motion } from 'framer-motion';
import { auth } from '../firebase';
import { createAnonymousPost, getRecentAnonymousPosts } from '../services/db';
import { AnonymousPost } from '../types/db';

export default function AnonymousZone() {
  const [posts, setPosts] = useState<AnonymousPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [isPosting, setIsPosting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const recentPosts = await getRecentAnonymousPosts();
        setPosts(recentPosts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handlePost = async () => {
    if (!newPost.trim() || !auth.currentUser) return;
    
    setIsPosting(true);
    try {
      // Extract tags (simple hashtag extraction)
      const tags = newPost.match(/#[a-zA-Z0-9_ก-๙]+/g) || ['#พูดคุย'];
      
      const postId = await createAnonymousPost(newPost, tags);
      
      // Optimistically add to UI
      const newPostObj: AnonymousPost = {
        id: postId,
        content: newPost,
        tags: tags,
        likes: 0,
        authorId: auth.currentUser.uid,
        createdAt: new Date().toISOString()
      };
      
      setPosts([newPostObj, ...posts]);
      setNewPost('');
    } catch (error) {
      console.error("Error creating post:", error);
      alert("ไม่สามารถโพสต์ได้ในขณะนี้");
    } finally {
      setIsPosting(false);
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'เมื่อสักครู่';
    // Handle both Firestore Timestamp and JS Date
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 60) return `${diffMins || 1} นาทีที่แล้ว`;
    if (diffHours < 24) return `${diffHours} ชั่วโมงที่แล้ว`;
    if (diffDays < 7) return `${diffDays} วันที่แล้ว`;
    return new Intl.DateTimeFormat('th-TH', { day: 'numeric', month: 'short' }).format(date);
  };

  // Generate a random avatar based on authorId (for consistency)
  const getAvatar = (authorId: string) => {
    const avatars = ['👻', '🐰', '🐻', '🦊', '🐼', '🐯', '🐸', '🐵'];
    // Simple hash of authorId to pick an avatar
    let hash = 0;
    for (let i = 0; i < authorId.length; i++) {
      hash = authorId.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatars[Math.abs(hash) % avatars.length];
  };

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 font-['Kanit']">
      <header className="mb-8 bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-3xl text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-y-1/2 translate-x-1/4 blur-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold font-['Fredoka'] mb-2 flex items-center">
            <ShieldAlert className="mr-3" size={32} /> พื้นที่ปลอดภัย (Anonymous Zone)
          </h1>
          <p className="text-indigo-100 max-w-2xl">
            แชร์ความรู้สึก ปรึกษาปัญหา หรือเล่าประสบการณ์โดยไม่ต้องเปิดเผยตัวตน 
            ที่นี่ทุกคนพร้อมรับฟังและให้กำลังใจคุณเสมอ 💙
          </p>
        </div>
      </header>

      {/* Create Post */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div className="flex space-x-4">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-2xl shrink-0">
            {auth.currentUser ? getAvatar(auth.currentUser.uid) : '👻'}
          </div>
          <div className="flex-1">
            <textarea 
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              placeholder="คุณกำลังคิดอะไรอยู่? แชร์ให้เพื่อนๆ ฟังได้นะ (สามารถใส่ #แท็ก ได้)"
              className="w-full bg-gray-50 border border-gray-200 rounded-2xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none min-h-[120px] transition-shadow"
            ></textarea>
            <div className="flex justify-between items-center mt-4">
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-indigo-500 px-3 py-1 rounded-full hover:bg-indigo-50 text-sm font-medium transition-colors">
                  # แท็ก
                </button>
                <button className="text-gray-400 hover:text-indigo-500 px-3 py-1 rounded-full hover:bg-indigo-50 text-sm font-medium transition-colors">
                  😊 อิโมจิ
                </button>
              </div>
              <button 
                onClick={handlePost}
                disabled={!newPost.trim() || isPosting || !auth.currentUser}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-xl font-bold flex items-center shadow-md shadow-indigo-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isPosting ? 'กำลังโพสต์...' : 'โพสต์'} <Send size={16} className="ml-2" />
              </button>
            </div>
            {!auth.currentUser && (
              <p className="text-sm text-red-500 mt-2">กรุณาเข้าสู่ระบบเพื่อโพสต์ข้อความ</p>
            )}
          </div>
        </div>
      </div>

      {/* Feed */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500 bg-white rounded-3xl border border-dashed border-gray-200">
            <p className="text-lg font-medium mb-2">ยังไม่มีโพสต์ในขณะนี้</p>
            <p className="text-sm">มาเป็นคนแรกที่แบ่งปันเรื่องราวกันเถอะ!</p>
          </div>
        ) : (
          posts.map((post) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              key={post.id} 
              className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center text-2xl border border-indigo-100">
                    {getAvatar(post.authorId)}
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-800">นักผจญภัยนิรนาม</h3>
                    <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
                  </div>
                </div>
                <button className="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-50">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <p className="text-gray-700 mb-4 leading-relaxed whitespace-pre-wrap">
                {post.content}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-6">
                {post.tags?.map(tag => (
                  <span key={tag} className="text-xs font-medium text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
              
              <div className="flex items-center space-x-6 border-t pt-4 text-gray-500">
                <button className="flex items-center space-x-2 hover:text-pink-500 transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-pink-50">
                    <Heart size={20} />
                  </div>
                  <span className="font-medium">{post.likes || 0}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-blue-500 transition-colors group">
                  <div className="p-2 rounded-full group-hover:bg-blue-50">
                    <MessageSquare size={20} />
                  </div>
                  <span className="font-medium">{post.comments || 0}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-green-500 transition-colors group ml-auto">
                  <div className="p-2 rounded-full group-hover:bg-green-50">
                    <Share2 size={20} />
                  </div>
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
