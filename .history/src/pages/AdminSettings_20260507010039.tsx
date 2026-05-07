import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Loader2, Save, Upload, Store, Image,
  MessageCircle, Instagram, Plus, Pencil, Trash2
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  getStoreSettings,
  saveStoreSettings,
  getProducts,
  deleteProduct,
  StoreSettings,
  Product
} from '@/services/storage';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);

  const [formData, setFormData] = useState<StoreSettings>({
    store_name: '',
    logo_url: '',
    hero_image_url: '',
    tagline: '',
    instagram: '',
    whatsapp: '',
  });

  useEffect(() => {
    const settings = getStoreSettings();
    const productList = getProducts();

    if (settings) setFormData(settings);
    setProducts(productList);
    setLoading(false);
  }, []);

  function handleSave() {
    saveStoreSettings(formData);
    toast.success('Configurações salvas com sucesso!');
  }

  function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'logo_url' | 'hero_image_url'
  ) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, [field]: reader.result as string });
    };
    reader.readAsDataURL(file);
  }

  function handleDeleteProduct(id: string) {
    deleteProduct(id);
    setProducts(getProducts());
    toast.success('Produto removido!');
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="bg-white border-b sticky top-0">
        <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
          <h1 className="text-lg font-medium">Painel Administrativo</h1>
          <Link to="/">
            <Button variant="outline">Ver Loja</Button>
          </Link>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <Tabs defaultValue="settings">
          <TabsList>
            <TabsTrigger value="settings">Configurações</TabsTrigger>
            <TabsTrigger value="products">Produtos</TabsTrigger>
          </TabsList>

          {/* SETTINGS */}
          <TabsContent value="settings">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex gap-2 items-center">
                    <Store size={18} /> Dados da Loja
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div>
                    <Label>Nome da Loja</Label>
                    <Input
                      value={formData.store_name}
                      onChange={e => setFormData({ ...formData, store_name: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Slogan</Label>
                    <Textarea
                      value={formData.tagline}
                      onChange={e => setFormData({ ...formData, tagline: e.target.value })}
                    />
                  </div>

                  <div>
                    <Label>Logo</Label>
                    <input type="file" onChange={e => handleImageUpload(e, 'logo_url')} />
                  </div>

                  <div>
                    <Label>Banner</Label>
                    <input type="file" onChange={e => handleImageUpload(e, 'hero_image_url')} />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label><Instagram size={14} /> Instagram</Label>
                      <Input
                        value={formData.instagram}
                        onChange={e => setFormData({ ...formData, instagram: e.target.value })}
                      />
                    </div>
                    <div>
                      <Label><MessageCircle size={14} /> WhatsApp</Label>
                      <Input
                        value={formData.whatsapp}
                        onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                      />
                    </div>
                  </div>

                  <Button onClick={handleSave}>
                    <Save size={16} className="mr-2" />
                    Salvar
                  </Button>
                </CardContent>
              </Card>
            </motion.div> 
          </TabsContent>

          {/* PRODUCTS */}
          <TabsContent value="products">
            <Card>
              <CardHeader className="flex flex-row justify-between">
                <CardTitle>Produtos</CardTitle>
                <Link to="/add-product">
                  <Button><Plus size={16} /> Novo</Button>
                </Link>
              </CardHeader>

              <CardContent className="space-y-4">
                {products.length === 0 && (
                  <p className="text-neutral-500">Nenhum produto cadastrado</p>
                )}

                {products.map(p => (
                  <div key={p.id} className="flex gap-4 border p-4 rounded">
                    <div className="w-16 h-20 bg-neutral-100 flex items-center justify-center">
                      {p.image_url
                        ? <img src={p.image_url} className="object-cover w-full h-full" />
                        : <Image />}
                    </div>

                    <div className="flex-1">
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-neutral-500">R$ {p.price.toFixed(2)}</p>
                    </div>

                    <div className="flex gap-2">
                      <Link to={`/add-product?id=${p.id}`}>
                        <Button variant="outline" size="icon">
                          <Pencil size={14} />
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleDeleteProduct(p.id)}
                      >
                        <Trash2 size={14} className="text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
