import AutoAnimateDiv from '../utils/AutoAnimateDiv';
import { useSession } from '../utils/useSession';
import useGet from '../utils/useGet';
import Modal from '../utils/Modal';
import useRequest from '../utils/useRequest';
import Place from '../utils/place';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { TrashIcon } from '@heroicons/react/20/solid';

export default () => {

  const session = useSession();
  const navigate = useNavigate();
  const { data, mutate } = useGet('/places/');
  const { post, del } = useRequest();

  const [isCreatingPlace, setIsCreatingPlace] = useState(false);
  const [placeName, setPlaceName] = useState('');

  const submit = async () => {
    try {
      const res = await post('/places/', { name: placeName });
      const data = await res.json();
      if (!res.ok) {
        alert(data.message);
        return;
      }
      await mutate();
      setIsCreatingPlace(false);
    } catch (e: any) {
      alert(e.message);
    }
  };

  const deletePlace = async (placeId: number) => {
    try {
      const res = await del('/places/' + placeId);
      if (!res.ok) {
        alert((await res.json()).message);
        return;
      }
      await mutate();
    } catch (e: any) {
      console.error(e.message);
    }
  };

  return (
    <div className="mb-32">

      <div className="flex w-full justify-between">
        <p className="p-6 font-bold text-primary"/>
        <p
          className="cursor-pointer p-6 font-bold text-primary"
          onClick={() => {
            session.clearToken();
            navigate('/login');
          }}
        >
          登出
        </p>
      </div>

      <div className="p-6 pt-0">
        <p className="mb-4 text-4xl font-bold">场景列表</p>
      </div>
      <AutoAnimateDiv className="px-6">
        {data?.map((place: Place) => <Link
          to={`/places/${place.id}/rooms`}
          key={place.id}
        >
          <div
            className="relative mb-4 flex h-32 w-full
             items-end rounded-lg bg-primary/20 p-4"
          >
            <TrashIcon
              className="absolute right-4 top-4 h-5 w-5
              cursor-pointer text-primary"
              onClick={async e => {
                e.preventDefault();
                await deletePlace(place.id);
              }}
            />
            <p>
              <span className="mr-4 text-5xl font-bold">{place.name}</span>
              共 {place.roomCount} 个房间
            </p>
          </div>
        </Link>)}
        <div
          key="new"
          className="mb-4 flex h-32 w-full items-end
             rounded-lg bg-primary/20 p-4"
          onClick={() => setIsCreatingPlace(true)}
        >
          <p className="text-center">+ 创建场景</p>
        </div>
      </AutoAnimateDiv>

      <Modal
        isOpened={isCreatingPlace}
        onClose={() => setIsCreatingPlace(false)}
      >
        <p className="mb-8 font-bold">新增场景</p>
        <div className="mb-4">
          <p className="mb-2">场景名</p>
          <input
            className="rounded-lg border p-2"
            value={placeName}
            onChange={e => setPlaceName(e.target.value)}
          />
        </div>
        <div className="mt-6 flex items-center">
          <button
            className="rounded-lg bg-primary px-12 py-2 text-white"
            onClick={submit}
          >
            确定
          </button>
          <p
            className="cursor-pointer px-12 text-zinc-600"
            onClick={() => setIsCreatingPlace(false)}
          >
            取消
          </p>
        </div>
      </Modal>
    </div>
  );
};
