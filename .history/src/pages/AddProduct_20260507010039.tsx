import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/api';
import { motion } from 'framer-motion';
import { Loader2, Save, Upload, ArrowLeft, Image, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AddProduct() {
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('id');
  const isEditing = !!productId;

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    image_url: '',
    category: '',
    sizes: ['P', 'M', 'G', 'GG'],
    featured: false,
    stock: 0,
  });

  const [uploading, setUploading] = useState(false);

  /* 🔎 Buscar produto */
  const { data: product, isLoading } = useQuery({
    queryKey: ['product', productId],
    enabled: isEditing,
    queryFn: async () => {
      const { data } = await api.get(`/products/${productId}`);
      return data;
    },
  });

  useEffect(() => {
    if (!product) return;

    setFormData({
      name: product.name ?? '',
      description: product.description ?? '',
      price: product.price?.toString() ?? '',
      image_url: product.image_url ?? '',
      category: product.category ?? '',
      sizes: product.sizes ?? ['P', 'M', 'G', 'GG'],
      featured: !!product.featured,
      stock: product.stock ?? 0,
    });
  }, [product]);

  /* 💾 Criar / Editar */
  const saveMutation = useMutation({
    mutationFn: async (data) => {
      const payload = {
        ...data,
        price: Number(data.price),
      };

      if (isEditing) {
        return api.put(`/products/${productId}`, payload);
      }
      return api.post('/products', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast.success(isEditing ? 'Produto atualizado!' : 'Produto criado!');
      navigate(createPageUrl('AdminSettings'));
    },
  });

  /* 🖼 Upload (mock simples) */
  const handleUploadImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);

      // Exemplo simples (sem backend real)
      const imageUrl = URL.createObjectURL(file);

      setFormData(prev => ({ ...prev, image_url: imageUrl }));
      toast.success('Imagem carregada!');
    } catch {
      toast.error('Erro ao enviar imagem');
    } finally {
      setUploading(false);
    }
  };

  const toggleSize = (size) => {
    setFormData(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }));
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const allSizes = ['PP', 'P', 'M', 'G', 'GG', 'XGG'];

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-4xl mx-auto px-6 h-16 flex items-center gap-4">
          <Link to={createPageUrl('AdminSettings')}>
            <Button variant="ghost" size="icon">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <h1 className="text-lg font-medium">
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardHeader>
              <CardTitle>Informações do Produto</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* resto do JSX permanece IGUAL */}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
